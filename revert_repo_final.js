const https = require('https');

const token = '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';
const repo = 'qwerewqwerew/cbot';
const targetCommit = '4bc42e3eb4d89f71986ec5d6855d61a14804ede3';

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: body }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function run() {
  try {
    // 1. Get Repo Info to find default branch
    console.log(`Checking repo: ${repo}...`);
    const repoInfo = await request({
      hostname: 'api.github.com',
      path: `/repos/${repo}`,
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'node.js'
      }
    });

    if (repoInfo.statusCode !== 200) {
      console.error(`Failed to get repo info: ${repoInfo.statusCode}`, repoInfo.body);
      return;
    }

    const defaultBranch = JSON.parse(repoInfo.body).default_branch;
    console.log(`Default branch is: ${defaultBranch}`);

    // 2. Update branch reference
    console.log(`Updating ${defaultBranch} to ${targetCommit}...`);
    const updateData = JSON.stringify({ sha: targetCommit, force: true });
    const updateRef = await request({
      hostname: 'api.github.com',
      path: `/repos/${repo}/git/refs/heads/${defaultBranch}`,
      method: 'PATCH',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'node.js',
        'Content-Type': 'application/json',
        'Content-Length': updateData.length
      }
    }, updateData);

    if (updateRef.statusCode === 200) {
      console.log('Successfully updated!');
      console.log(updateRef.body);
    } else {
      console.error(`Failed to update branch: ${updateRef.statusCode}`, updateRef.body);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

run();
