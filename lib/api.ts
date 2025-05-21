import { User, userArraySchema } from './models';

/**
 * API response structure from organizations endpoint
 */
type OrganizationsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
};

/**
 * Verification status types
 */
export type VerificationStatus = 'approved' | 'denied' | 'pending' | 'rejected';

/**
 * Verification request payload
 */
type VerificationRequest = {
  verification_status: VerificationStatus;
};

/**
 * Fetches all organizations from the API
 * @returns Promise resolving to an array of User objects
 */
export async function fetchOrganizations(): Promise<User[]> {
  try {
    const response = await fetch('https://www.mindahun.pro.et/api/v1/organizations/');
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json() as OrganizationsResponse;
    
    return data.results;
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw error;
  }
}

/**
 * Fetches a single organization by ID
 * @param id Organization ID to fetch
 * @returns Promise resolving to a User object
 */
export async function fetchOrganizationById(id: number): Promise<User> {
  const organizations = await fetchOrganizations();
  const organization = organizations.find(org => org.id === id);
  
  if (!organization) {
    throw new Error(`Organization with ID ${id} not found`);
  }
  
  return organization;
}

/**
 * Verifies an organization's status (approve or deny)
 * @param id Organization ID to verify
 * @param status The verification status to set (approved, rejected, pending)
 * @returns Promise resolving to the updated organization data
 */
export async function verifyOrganization(
  id: number, 
  status: VerificationStatus
): Promise<any> {
  try {
    // Convert 'denied' to 'rejected' if needed to match API expectations
    const apiStatus = status === 'denied' ? 'rejected' : status;
    
    // Add status as a query parameter
    const url = `https://www.mindahun.pro.et/api/v1/organizations/${id}/verify/?status=${apiStatus}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Empty body as we're using query param
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error ${status === 'approved' ? 'approving' : 'denying'} organization:`, error);
    throw error;
  }
} 