     1	const express = require('express');
     2	const cheerio = require('cheerio');
     3	const axios = require('axios');
     4	const path = require('path');
     5	const app = express();
     6	
     7	app.use(express.static(path.join(__dirname, 'public')));
     8	
     9	app.set('view engine', 'ejs');
    10	
    11	
    12	async function fazerScraping() {
    13	  try {
    14	    // 1. Busca o HTML
    15	    const { data } = await axios.get('https://animesdigital.org/home');
    16	    // 2. Carrega o HTML no Cheerio
    17	    const $ = cheerio.load(data);
    18	    // 3. Extrai dados usando seletores CSS
    19	    const dados = $.extract({
    20	      titulo: ['div.itemE a[title] div.title span.title_anime'],
    21	      epsisodio: ['div.itemE a[title] div.title span.number'],
    22	      img: [{
    23	        selector: 'div.itemE a[title] div.thumb img[title]',
    24	        value: 'src'
    25	      }],
    26	      url: [{
    27	        selector: 'div.itemE a[title]',
    28	        value: 'href'
    29	      }],
    30	    });
    31	
    32	    let episodes = []
    33	    let estruture = {}
    34	    for (let i = 8; i <= dados.titulo.length - 1; i++) {
    35	      estruture = {
    36	        title: dados.titulo[i],
    37	        episode: dados.epsisodio[i],
    38	        src: dados.img[i],
    39	        url: dados.url[i]
    40	      };
    41	      episodes.push(estruture);
    42	      estruture = {}
    43	    }
    44	
    45	    return episodes;
    46	  } catch (error) {
    47	    console.error(error);
    48	  }
    49	}
    50	
    51	// Página inicial
    52	app.get('/', async (req, res) => {
    53	  const dados = await fazerScraping();
    54	  res.render('index', { dados: dados });
    55	});
    56	
    57	//lancamentos
    58	app.get('/lancamentos', async(req, res) => {
    59	  async function releases() {
    60	    try {
    61	      // 1. Busca o HTML
    62	      const { data } = await axios.get('https://animesdigital.org/home');
    63	      // 2. Carrega o HTML no Cheerio
    64	      const $ = cheerio.load(data);
    65	      // 3. Extrai dados usando seletores CSS
    66	      const dados = $.extract({
    67	        titulo: ['div.itemE a[title] div.title span.title_anime'],
    68	        epsisodio: ['div.itemE a[title] div.title span.number'],
    69	        img: [{
    70	          selector: 'div.itemE a[title] div.thumb img[title]',
    71	          value: 'src'
    72	        }],
    73	        url: [{
    74	          selector: 'div.itemE a[title]',
    75	          value: 'href'
    76	        }],
    77	      });
    78	
    79	      let episodes = []
    80	      let estruture = {}
    81	      for (let i = 0; i <= 7; i++) {
    82	        estruture = {
    83	          title: dados.titulo[i],
    84	          episode: dados.epsisodio[i],
    85	          src: dados.img[i],
    86	          url: dados.url[i]
    87	        };
    88	        episodes.push(estruture);
    89	        estruture = {}
    90	      }
    91	
    92	     
    93	      return episodes;
    94	    } catch (error) {
    95	      console.error(error);
    96	    }
    97	  }
    98	
    99	  const dados = await releases();
   100	
   101	  res.render('lancamentos',{dados:dados});
   102	});
   103	
   104	
   105	
   106	//search
   107	app.get('/search', async (req, res) => {
   108	  const requisition = req.query.title;
   109	  let newReq
   110	  if (requisition) {
   111	    newReq = requisition.replace(/ /g, '+');
   112	
   113	  } else {
   114	    newReq = '';
   115	
   116	  }
   117	  console.log(newReq)
   118	  async function search(title) {
   119	    try {
   120	      // 1. Busca o HTML
   121	      const { data } = await axios.get('https://animesdigital.org/search/' + title);
   122	      // 2. Carrega o HTML no Cheerio
   123	      const $ = cheerio.load(data);
   124	      // 3. Extrai dados usando seletores CSS
   125	      const dados = $.extract({
   126	        titulo: ['div.itemA a[title] div.title span.title_anime'],
   127	        epsisodio: ['div.itemA a[title] div.title span.number'],
   128	        img: [{
   129	          selector: 'div.itemA a[title] div.thumb img[title]',
   130	          value: 'src'
   131	        }],
   132	        url: [{
   133	          selector: 'div.itemA a[title]',
   134	          value: 'href'
   135	        }],
   136	      });
   137	
   138	      let episodes = []
   139	      let estruture = {}
   140	      for (let i = 0; i <= dados.titulo.length - 1; i++) {
   141	        estruture = {
   142	          title: dados.titulo[i],
   143	          episode: dados.epsisodio[i],
   144	          src: dados.img[i],
   145	          url: dados.url[i]
   146	        };
   147	        episodes.push(estruture);
   148	        estruture = {}
   149	      }
   150	
   151	      return episodes;
   152	    } catch (error) {
   153	      console.error(error);
   154	    }
   155	  }
   156	
   157	  const dados = await search(newReq);
   158	
   159	  res.render('searchPage',{dados:dados})
   160	});
   161	
   162	// assistir
   163	app.get('/assistir', async (req, res) => {
   164	  const url = req.query.url
   165	  console.log(url)
   166	
   167	  async function assistirvideo(url) {
   168	    try {
   169	      // 1. Busca o HTML
   170	      const { data } = await axios.get(url);
   171	      // 2. Carrega o HTML no Cheerio
   172	      const $ = cheerio.load(data);
   173	      // 3. Extrai dados usando seletores CSS
   174	      const dados = $.extract({
   175	        video: {
   176	          selector: 'iframe.metaframe.rptss.no-lazy',
   177	          value: 'src'
   178	        },
   179	      });
   180	
   181	      return dados;
   182	    } catch (error) {
   183	      console.error(error);
   184	    }
   185	  }
   186	
   187	  const dados = await assistirvideo(url);
   188	
   189	
   190	  res.render('assistir', { dados: dados })
   191	});
   192	
   193	//info
   194	app.get('/info', async (req, res) => {
   195	  const requisition = req.query.url;
   196	  console.log(requisition)
   197	  async function informe(url) {
   198	    try {
   199	      // 1. Busca o HTML
   200	      const { data } = await axios.get(url);
   201	      // 2. Carrega o HTML no Cheerio
   202	      const $ = cheerio.load(data);
   203	      // 3. Extrai dados usando seletores CSS
   204	      const dados = $.extract({
   205	        titulo: ['div.dados h1'],
   206	        info: ['div.info'],
   207	        genre: ['div.genres div.genre'],
   208	        sinopse: 'div.sinopse',
   209	        epsisodio: ['div.title_anime'],
   210	        img: {
   211	          selector: 'div.poster img[title]',
   212	          value: 'src'
   213	        },
   214	        url: [{
   215	          selector: 'div.item_ep a',
   216	          value: 'href'
   217	        }],
   218	      });
   219	
   220	      let episodes = []
   221	      let estruture = {}
   222	      for (let i = 0; i <= dados.titulo.length - 1; i++) {
   223	        estruture = {
   224	          title: dados.titulo[i],
   225	          episode: dados.epsisodio[i],
   226	          src: dados.img[i],
   227	          url: dados.url[i]
   228	        };
   229	        episodes.push(estruture);
   230	        estruture = {}
   231	      }
   232	
   233	      return dados;
   234	    } catch (error) {
   235	      console.error(error);
   236	    }
   237	  }
   238	  const dados = await informe(requisition);
   239	  res.render('info', { dados: dados })
   240	});
   241	
   242	app.listen(3000, () => {
   243	  console.log('Servidor rodando');
   244	});