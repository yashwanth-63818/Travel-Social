// Test script to verify backend API endpoints
// Run with: node test-api.js

const API_URL = 'http://localhost:5000';

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', body = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Starting TravelSocial API Tests...\n');

  let token = null;
  let userId = null;
  let postId = null;

  // Test 1: Health check
  console.log('Test 1: Server health check');
  const health = await apiCall('/api');
  console.log(health.success ? '✅ PASS' : '❌ FAIL', health);
  console.log('');

  // Test 2: Signup
  console.log('Test 2: User signup');
  const signupData = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
  };
  const signup = await apiCall('/api/auth/signup', 'POST', signupData);
  console.log(signup.success ? '✅ PASS' : '❌ FAIL', signup);
  
  if (signup.success) {
    token = signup.data.token;
    userId = signup.data.user._id;
    console.log(`Token: ${token.substring(0, 20)}...`);
    console.log(`User ID: ${userId}`);
  }
  console.log('');

  // Test 3: Create post
  console.log('Test 3: Create post (authenticated)');
  const postData = {
    content: 'Test post from API test script! 🚀',
    location: 'Test City',
  };
  const createPost = await apiCall('/api/posts', 'POST', postData, token);
  console.log(createPost.success ? '✅ PASS' : '❌ FAIL', createPost);
  
  if (createPost.success) {
    postId = createPost.data._id;
    console.log(`Post ID: ${postId}`);
  }
  console.log('');

  // Test 4: Get all posts
  console.log('Test 4: Get all posts');
  const getPosts = await apiCall('/api/posts');
  console.log(getPosts.success ? '✅ PASS' : '❌ FAIL');
  console.log(`Found ${getPosts.data?.length || 0} posts`);
  console.log('');

  // Test 5: Like post
  console.log('Test 5: Like post (authenticated)');
  const likePost = await apiCall(`/api/posts/${postId}/like`, 'POST', null, token);
  console.log(likePost.success ? '✅ PASS' : '❌ FAIL', likePost);
  console.log('');

  // Test 6: Add comment
  console.log('Test 6: Add comment (authenticated)');
  const commentData = {
    content: 'Test comment from API test script!',
  };
  const addComment = await apiCall(`/api/posts/${postId}/comments`, 'POST', commentData, token);
  console.log(addComment.success ? '✅ PASS' : '❌ FAIL', addComment);
  console.log('');

  // Test 7: Get comments
  console.log('Test 7: Get comments for post');
  const getComments = await apiCall(`/api/posts/${postId}/comments`);
  console.log(getComments.success ? '✅ PASS' : '❌ FAIL');
  console.log(`Found ${getComments.data?.length || 0} comments`);
  console.log('');

  // Test 8: Get user profile
  console.log('Test 8: Get user profile with stats');
  const getUser = await apiCall(`/api/users/${userId}`);
  console.log(getUser.success ? '✅ PASS' : '❌ FAIL');
  if (getUser.success) {
    console.log('Stats:', getUser.data.stats);
  }
  console.log('');

  // Test 9: Get user posts
  console.log('Test 9: Get user posts');
  const getUserPosts = await apiCall(`/api/users/${userId}/posts`);
  console.log(getUserPosts.success ? '✅ PASS' : '❌ FAIL');
  console.log(`Found ${getUserPosts.data?.length || 0} posts by user`);
  console.log('');

  console.log('🎉 All tests completed!');
}

// Run tests
runTests().catch(console.error);
