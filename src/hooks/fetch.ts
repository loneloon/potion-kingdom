
export interface SlotsGameDto {
       matrix: { [key: string]: string};
      matches: boolean
        clusters: SymbolClusterDto[]
}


export interface SymbolClusterDto{
    'coordinates': string;
            'payout_modifier': number;
            'id': string;
            'datetime': string;
            'signature': string;
}

export async function FetchSlotsGame(gameProviderApiUrl: string): Promise<SlotsGameDto | null> {
    try {
        // 👇️ const response: Response
        const response = await fetch(gameProviderApiUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });
    
        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }
    
        // 👇️ const result: GetUsersResponse
        const result = (await response.json()) as SlotsGameDto;

        return result;
      } catch (error) {
        console.warn(error.message)
        return null
      }
    }

