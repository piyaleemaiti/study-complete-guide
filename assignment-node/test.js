const http = require('http');

requestListner = (req, res, next) => {
  if(req.url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Node JS</title></head>');
    res.write('<body><p>Welcome to My First Node JS</p>');
    res.write('<form action="/create-user" method="POST"><input type="text" name="username" /><input type="submit" value="Add User" /></form>')
    res.write('</body></html>');
    return res.end();
  }
  if(req.url === '/users') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Node JS</title></head>');
    res.write('<body><ul><li>Dhruba</li><li>Piyalee</li></ul></body>');
    res.write('</html>');
    return res.end();
  }
  if (req.url === '/create-user' && req.method === "POST") {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    });
    req.on('end', () => {
      const parseBody = Buffer.concat(body).toString();
      console.log(parseBody.split('=')[1]);
    });
    res.statusCode = 302;
    res.setHeader('Location', '/');
    res.end();
  }
};

const server = http.createServer(requestListner);
server.listen(3000);
