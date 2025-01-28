import axios, { AxiosError } from 'axios';
import { config } from 'dotenv';

// Load environment variables
config();

const API_URL = process.env.API_URL || 'http://localhost:3000';
const TEST_USER_ID = process.env.TEST_USER_ID || 'test-user-id';

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

interface CompetitionResponse {
  competitionTxHash: string;
  poolTxHashes: string[];
  poolKeys: string[];
}

async function testCreateCompetitionWithPools() {
  console.log('Testing Create Competition with Pools...');
  try {
    const response = await axios.post<CompetitionResponse>(`${API_URL}/competition/create`, {
      userId: TEST_USER_ID,
      competitionHash: "11111111111111111111111111111111",
      tokenA: "So11111111111111111111111111111111111111112",
      priceFeedId: "BTC/USD",
      adminKeys: ["11111111111111111111111111111111"],
      houseCutFactor: 100,
      minPayoutRatio: 200,
      interval: 3600,
      startTime: Math.floor(Date.now() / 1000) + 3600, // Start in 1 hour
      endTime: Math.floor(Date.now() / 1000) + 7200,   // End in 2 hours
      treasury: "11111111111111111111111111111111"
    });

    console.log('Create Competition Response:', {
      competitionTxHash: response.data.competitionTxHash,
      poolTxHashes: response.data.poolTxHashes,
      poolKeys: response.data.poolKeys
    });

    return response.data;
  } catch (error) {
    console.error('Create Competition Error:', (error as AxiosError).response?.data || error);
    throw error;
  }
}

async function testUpdateCompetition(competitionKey: string) {
  console.log('\nTesting Update Competition...');
  try {
    const response = await axios.put(`${API_URL}/competition/update`, {
      userId: TEST_USER_ID,
      competitionKey,
      tokenA: "So11111111111111111111111111111111111111112",
      priceFeedId: "BTC/USD",
      adminKeys: ["11111111111111111111111111111111"],
      houseCutFactor: 150,
      minPayoutRatio: 250,
      interval: 7200,
      startTime: Math.floor(Date.now() / 1000) + 3600,
      endTime: Math.floor(Date.now() / 1000) + 7200
    });
    console.log('Update Competition Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update Competition Error:', (error as AxiosError).response?.data || error);
    throw error;
  }
}

async function testCreateBet(competitionKey: string, poolKey: string) {
  console.log('\nTesting Create Bet...');
  try {
    const response = await axios.post(`${API_URL}/order/create-bet`, {
      userId: TEST_USER_ID,
      amount: 1000000,
      lowerBoundPrice: 40000,
      upperBoundPrice: 45000,
      poolKey,
      competitionKey
    });
    console.log('Create Bet Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create Bet Error:', (error as AxiosError).response?.data || error);
    throw error;
  }
}

async function testCancelBet(poolKey: string, betHash: string) {
  console.log('\nTesting Cancel Bet...');
  try {
    const response = await axios.post(`${API_URL}/order/cancel-bet`, {
      userId: TEST_USER_ID,
      poolKey,
      betHash
    });
    console.log('Cancel Bet Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Cancel Bet Error:', (error as AxiosError).response?.data || error);
    throw error;
  }
}

async function runTests() {
  try {
    // Create competition with pools and get transaction hashes and pool keys
    const compResult = await testCreateCompetitionWithPools();
    console.log('\nWaiting for competition and pool transactions to confirm...');
    await delay(2000); // Wait for transaction confirmation

    // Update the competition using the first pool key as competition key
    // Note: You might need to adjust this based on your actual response structure
    await testUpdateCompetition(compResult.poolKeys[0]);
    await delay(2000);

    // Create a bet using the first pool
    const betResult = await testCreateBet(compResult.poolKeys[0], compResult.poolKeys[0]);
    await delay(2000);

    // Cancel the bet
    if (betResult.betHash) {
      await testCancelBet(compResult.poolKeys[0], betResult.betHash);
    }

    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('\nTest suite failed:', error);
    process.exit(1);
  }
}

// Run the tests
runTests().catch(console.error); 