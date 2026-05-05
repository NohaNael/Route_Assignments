const app = require("./app");
const { sequelize } = require("./models");

const PORT = Number(process.env.PORT || 3000);

async function init() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    await sequelize.sync({ alter: true });
    console.log("All models were synchronized successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start the application:", error.message);
  }
}

init();
