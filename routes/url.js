const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const shortId = require('shortid');
const Url = require('../models/Url');

// @author      Bihan Chakraborty
// @route       GET /:urlCode
// @desc        Redirect to long/original URL

router.get('/:urlCode', async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.urlCode });

    if (!url) {
      return res.status(400).json('Invalid short URL');
    }

    return res.redirect(url.longUrl);
  } catch (err) {
    console.log(err.message);
    res.status(500).json('Server Error');
  }
});

// @author      Bihan Chakraborty
// @route       POST /api/url/shorten
// @desc        Create short URL

router.post('/api/shorten', async (req, res) => {
  const { longUrl } = req.body;

  //Check if long URL is valid
  if (!validUrl.isUri(longUrl)) {
    return res.status(400).json('Invalid long URL');
  }

  try {
    let url = await Url.findOne({ longUrl });

    //Check if URL already exists
    if (url) {
      return res.status(200).json(url);
    }

    let urlCode = shortId.generate();

    let chk = await Url.findOne({ urlCode });

    while (chk) {
      urlCode = shortId.generate();
      chk = await Url.findOne({ urlCode });
    }

    const shortUrl = baseUrl + '/' + urlCode;

    //Create new URL object
    url = new Url({
      urlCode,
      shortUrl,
      longUrl,
      date: new Date(),
    });
    await url.save();
    return res.status(200).json(url);
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server Error');
  }
});

module.exports = router;
