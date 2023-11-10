export async function getServerSideProps() {
  try {
    const res = await fetch('https://api.whatsonchain.com/v1/bsv/main/chain/info');
    if (!res.ok) {
      // The API call was unsuccessful
      console.error('Failed to fetch current block info', res.status, res.statusText);
      return { props: { currentBlock: null } };
    }
    const data = await res.json();

    // Log the data to see what is being returned
    console.log('Current block data:', data);

    // Make sure to access the correct property that contains the current block information
    const currentBlock = data; // Adjust this if the current block data is nested within the response

    // Check if currentBlock is undefined
    if (currentBlock === undefined) {
      throw new Error('Current block is undefined');
    }

    return { props: { currentBlock } };
  } catch (error) {
    console.error('Error in getServerSideProps:', error.message);
    // Return null or an empty object if there's an error or if currentBlock is undefined
    return { props: { currentBlock: null } };
  }
}