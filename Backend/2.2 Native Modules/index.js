const fs = require("fs");

fs.writeFile("message.txt", "Hello from Thomas!", (err) =>{
    if (err)throw err;
    console.log("File has been saved!");
});


fs.readFile('./message.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log(data);
});
