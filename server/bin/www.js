const app = require('../app');

const port = Number(process.env.PORT || 5767);
app.listen(port, () => console.log(`Pulau Seribu Stay API listening on port ${port}`));
