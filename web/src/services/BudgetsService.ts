export const BudgetsService = {
  async getData() {
    let categories = {};
    await fetch(`${process.env.API_URL}budgets`, {
      method: "GET"
    }).then(async (res) => {
      if (res.ok) {
        const jsonData = await res.json();
        categories = jsonData;
      } else {
        console.log('res err? :: ', res);
      }
    }).catch(err => {
      console.log('error :: ', err);
    });

    return categories;
  },
}