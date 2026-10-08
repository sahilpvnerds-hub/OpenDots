
const BOT_TOKEN = process.env.INTELLIGENCE_CHANNEL_OPENDOTS_SLACK_BOT_TOKEN;
const MESSAGE = process.argv[2] || 'Good morning guys! ☀️';

async function broadcast() {
  if (!BOT_TOKEN) {
    console.error('Error: INTELLIGENCE_CHANNEL_OPENDOTS_SLACK_BOT_TOKEN is missing in .env');
    return;
  }

  // 1. Fetch all public & private channels
  const channelsRes = await fetch('https://slack.com/api/conversations.list?types=public_channel,private_channel', {
    headers: { Authorization: `Bearer ${BOT_TOKEN}` },
  });
  const data = await channelsRes.json();

  if (!data.ok) {
    console.error('Failed to list channels:', data.error);
    return;
  }

  console.log(`Found ${data.channels.length} channels. Broadcasting: "${MESSAGE}"\n`);

  // 2. Post message to each channel
  for (const ch of data.channels) {
    try {
      // Join channel if not already in it
      await fetch('https://slack.com/api/conversations.join', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channel: ch.id }),
      });

      // Post the message
      const postRes = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: ch.id,
          text: MESSAGE,
        }),
      });

      const postData = await postRes.json();
      if (postData.ok) {
        console.log(`✅ Sent to #${ch.name} (${ch.id})`);
      } else {
        console.log(`❌ Failed for #${ch.name}: ${postData.error}`);
      }
    } catch (err) {
      console.error(`Error sending to #${ch.name}:`, err.message);
    }
  }

  console.log('\n🎉 Broadcast completed!');
}

broadcast();
