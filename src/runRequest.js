
export default async function runRequest(body) {
    // const { body } = await client.search({
    //     index: 'gutenberg',
    //     // type: '_doc', // uncomment this line if you are using {es} ≤ 6
    //     body: requestBody
    //   })

    const response = await fetch("http://localhost:9200/gutenberg/_search", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
    return response.json();
  }