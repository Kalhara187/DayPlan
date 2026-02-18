import axios from 'axios';

async function testEmailEndpoint() {
    try {
        console.log('Testing email endpoint...\n');
        
        const response = await axios.post('http://localhost:5000/api/notifications/test', {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer fake-token-for-testing'
            }
        });
        
        console.log('✅ Response status:', response.status);
        console.log('Response data:', JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.error('❌ Request failed');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
}

testEmailEndpoint();
