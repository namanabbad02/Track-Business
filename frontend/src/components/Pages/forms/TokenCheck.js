const expTime = decoded.exp * 1000; // Convert to milliseconds
const timeLeft = expTime - Date.now();

if (timeLeft > 0) {
  console.log(`Token expires in ${Math.floor(timeLeft / 1000)} seconds`);
} else {
  console.log('Token has expired');
}
const expirationDate = new Date(expTime);
console.log(`Token expires at: ${expirationDate.toLocaleString()}`);