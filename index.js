const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');


async function fazerScraping() {
  try {
    // 1. Busca o HTML
    const { data } = await axios.get('https://animesdigital.org/home');
    // 2. Carrega o HTML no Cheerio
    const $ = cheerio.load(data);
    // 3. Extrai dados usando seletores CSS
    const dados = $.extract({
      titulo: ['div.itemE a[title] div.title span.title_anime'],
      epsisodio: ['div.itemE a[title] div.title span.number'],
      img: [{
        selector: 'div.itemE a[title] div.thumb img[title]',
        value: 'src'
      }],
      url: [{
        selector: 'div.itemE a[title]',
        value: 'href'
      }],
    });

    let episodes = []
    let estruture = {}
    for (let i = 8; i <= dados.titulo.length - 1; i++) {
      estruture = {
        title: dados.titulo[i],
        episode: dados.epsisodio[i],
        src: dados.img[i],
        url: dados.url[i]
      };
      episodes.push(estruture);
      estruture = {}
    }

    return episodes;
  } catch (error) {
    console.error(error);
  }
}

// Página inicial
app.get('/', async (req, res) => {
  const dados = await fazerScraping();
  res.render('index', { dados: dados });
});

//lancamentos
app.get('/lancamentos', async (req, res) => {
  async function releases() {
    try {
      // 1. Busca o HTML
      const { data } = await axios.get('https://animesdigital.org/home');
      // 2. Carrega o HTML no Cheerio
      const $ = cheerio.load(data);
      // 3. Extrai dados usando seletores CSS
      const dados = $.extract({
        titulo: ['div.itemE a[title] div.title span.title_anime'],
        epsisodio: ['div.itemE a[title] div.title span.number'],
        img: [{
          selector: 'div.itemE a[title] div.thumb img[title]',
          value: 'src'
        }],
        url: [{
          selector: 'div.itemE a[title]',
          value: 'href'
        }],
      });

      let episodes = []
      let estruture = {}
      for (let i = 0; i <= 7; i++) {
        estruture = {
          title: dados.titulo[i],
          episode: dados.epsisodio[i],
          src: dados.img[i],
          url: dados.url[i]
        };
        episodes.push(estruture);
        estruture = {}
      }


      return episodes;
    } catch (error) {
      console.error(error);
    }
  }

  const dados = await releases();

  res.render('lancamentos', { dados: dados });
});



//search
app.get('/search', async (req, res) => {
  const requisition = req.query.title;
  let newReq
  if (requisition) {
    newReq = requisition.replace(/ /g, '+');

  } else {
    newReq = '';

  }
  console.log(newReq)
  async function search(title) {
    try {
      // 1. Busca o HTML
      const { data } = await axios.get('https://animesdigital.org/search/' + title);
      // 2. Carrega o HTML no Cheerio
      const $ = cheerio.load(data);
      // 3. Extrai dados usando seletores CSS
      const dados = $.extract({
        titulo: ['div.itemA a[title] div.title span.title_anime'],
        epsisodio: ['div.itemA a[title] div.title span.number'],
        img: [{
          selector: 'div.itemA a[title] div.thumb img[title]',
          value: 'src'
        }],
        url: [{
          selector: 'div.itemA a[title]',
          value: 'href'
        }],
      });

      let episodes = []
      let estruture = {}
      for (let i = 0; i <= dados.titulo.length - 1; i++) {
        estruture = {
          title: dados.titulo[i],
          episode: dados.epsisodio[i],
          src: dados.img[i],
          url: dados.url[i]
        };
        episodes.push(estruture);
        estruture = {}
      }

      return episodes;
    } catch (error) {
      console.error(error);
    }
  }

  const dados = await search(newReq);

  res.render('searchPage', { dados: dados })
});

// assistir
app.get('/assistir', async (req, res) => {
  const url = req.query.url
  console.log(url)

  async function assistirvideo(url) {
    try {
      // 1. Busca o HTML
      const { data } = await axios.get(url);
      // 2. Carrega o HTML no Cheerio
      const $ = cheerio.load(data);
      // 3. Extrai dados usando seletores CSS
      const dados = $.extract({
        video: {
          selector: 'iframe.metaframe.rptss.no-lazy',
          value: 'src'
        },
      });

      return dados;
    } catch (error) {
      console.error(error);
    }
  }

  const dados = await assistirvideo(url);


  res.render('assistir', { dados: dados })
});

//info
app.get('/info', async (req, res) => {
  const requisition = req.query.url;
  console.log(requisition)
  async function informe(url) {
    try {
      // 1. Busca o HTML
      const { data } = await axios.get(url);
      // 2. Carrega o HTML no Cheerio
      const $ = cheerio.load(data);
      // 3. Extrai dados usando seletores CSS
      const dados = $.extract({
        titulo: ['div.dados h1'],
        info: ['div.info'],
        genre: ['div.genres div.genre'],
        sinopse: 'div.sinopse',
        epsisodio: ['div.title_anime'],
        img: {
          selector: 'div.poster img[title]',
          value: 'src'
        },
        url: [{
          selector: 'div.item_ep a',
          value: 'href'
        }],
      });

      let episodes = []
      let estruture = {}
      for (let i = 0; i <= dados.titulo.length - 1; i++) {
        estruture = {
          title: dados.titulo[i],
          episode: dados.epsisodio[i],
          src: dados.img[i],
          url: dados.url[i]
        };
        episodes.push(estruture);
        estruture = {}
      }

      return dados;
    } catch (error) {
      console.error(error);
    }
  }
  const dados = await informe(requisition);
  res.render('info', { dados: dados })
});

app.listen(3000, () => {
  console.log('Servidor rodando');
});
