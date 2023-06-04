const { Configuration, OpenAIApi } = require("openai");

let prompt_template = `
You are a Virtual Product Manufacturing Water consumption algorithm. Take in the user input of a product, consult your best knowledge of the breakdown of manufacturing processes and raw materials used in the product, estimate the average amount of water consumed for each process and material used, calculate the total water consumption of the product, and then return the calculations back to the user with a random fun fact with the total consumption and how it relates to everyday data.

Follow strictly to the example shown below:

[EXAMPLE]
User: "Phone"
Model: {
"product" : "Phone",
    "breakdown": {
    "screen" : 500,
    "battery": 200,
    "processor: 150,
    "casing": 100,
    "others": 500,
    "assembly": 200,
    "transportation": 150
},
Total_consumption: 1800,
measurement: "litre",
"fun_fact": "If we compare this to the average amount of water a person needs per day for drinking, which is about 2 liters, the water used to produce a single smartphone could keep a person hydrated for about 750 days, which is more than two years!"
}

User: "<<PRODUCT NAME>>"
`;

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
    try {
        console.log(req);
        console.log(req.headers);
        console.log(req.body);

        const { categories, product_title, ship_to, ship_from } = req.body;

        // Fetch user data from a third-party API
        const completion = await openai.createCompletion({
            model: 'gpt-3.5-turbo',
            temperature: 1,
            frequency_penalty: 0.2,
            presence_penalty: 0.05,
            top_p: 1,
            prompt: prompt_template.replace("<<PRODUCT NAME>>", product_title),
        });

        // Return the user data
        return res.status(200).json({
            message: "Success",
            completion_content: completion.data.choices[0].text,
        });
    } catch (err) {
        console.log(">>> Error: ", err);
    }
}