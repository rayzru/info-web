/**
 * Test SMTP configuration locally
 */
import { getTransporter, emailConfig } from "./src/server/email/config";

async function testSmtp() {
  console.log("Testing SMTP configuration...");
  console.log(`From: ${emailConfig.from.name} <${emailConfig.from.address}>`);
  console.log(`Reply-To: ${emailConfig.replyTo}`);
  
  const transporter = getTransporter();
  
  try {
    await transporter.verify();
    console.log("✅ SMTP connection verified successfully!");
  } catch (error) {
    console.error("❌ SMTP verification failed:", error);
    process.exit(1);
  }
}

testSmtp();
