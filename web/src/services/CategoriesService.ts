export const CategoriesService = {
  async getData() {
    let categories = {};
    await fetch(`${process.env.API_URL}categories`, {
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
  async create(data: any) {
    let resp;
    const fetchData = await fetch(`${process.env.API_URL}create-category`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (fetchData.ok) {
      const jsonData = await fetchData.json()
      resp = jsonData;
    }

    return resp
  },
  async delete(data: any) {
    let resp;
    const fetchData = await fetch(`${process.env.API_URL}delete-category`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (fetchData.ok) {
      const jsonData = await fetchData.json()
      resp = jsonData;
    }

    return resp
  },
  async update(data: any) {
    let resp;
    const fetchData = await fetch(`${process.env.API_URL}update-category`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (fetchData.ok) {
      const jsonData = await fetchData.json()
      resp = jsonData;
    }

    return resp
  }
}