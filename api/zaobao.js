// Vercel Serverless Function: 代理请求，解决跨域
module.exports = async (req, res) => {
  // 1. 设置CORS头，允许任何网页访问（部署后可改成你的具体域名）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  // 2. 处理浏览器预检请求（OPTIONS）
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // 3. 只允许GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '只支持GET方法' });
  }
  
  try {
    // 4. 你的原始新闻API地址（令牌已包含在内）
    const targetUrl = 'https://v3.alapi.cn/api/zaobao?token=j6H97ztRoOm1JbJh&format=json';
    
    // 5. 向原始API发起请求
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      throw new Error(`上游API错误: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 6. 将获取的数据原样返回给你的网页
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json(data);
    
  } catch (error) {
    // 7. 错误处理
    console.error('代理接口错误:', error);
    res.status(500).json({ 
      error: '获取数据失败', 
      message: error.message 
    });
  }
};