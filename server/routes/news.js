import axios from "axios";

const getTopHeadlines = async (req, res) => {
  try {
    const apiKey = '1b35039736ad40e19f8c0372a495a0bc';
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
    res.json(response.data.articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default getTopHeadlines;