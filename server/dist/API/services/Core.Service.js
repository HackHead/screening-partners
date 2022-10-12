import newspaperjs from "newspaperjs";
import puppeteer from "puppeteer";
import jwt from "jsonwebtoken";
import Keyword from "../../models/KeywordModel.js";
export default class BaseService {
    // Get list of all keywords
    getKeyWords() {
        return new Promise((resolve, reject) => {
            (async () => {
                await Keyword.findAll()
                    .then((keywords) => {
                    resolve(keywords);
                }).catch((err) => {
                    reject(err);
                });
            })();
        });
    }
    // Create new keyword
    createKeyWord(newKeyword) {
        return new Promise((resolve, reject) => {
            (async () => {
                await Keyword.create({
                    name: newKeyword
                }).then((created) => {
                    resolve(created);
                }).catch((err) => {
                    reject(err);
                });
            })();
        });
    }
    // Delete keyword by id
    deleteKeyWord(keyWordId) {
        console.log(keyWordId);
        return new Promise((resolve, reject) => {
            (async () => {
                await Keyword.destroy({
                    where: {
                        _id: keyWordId
                    }
                }).then((deleted) => {
                    resolve(deleted);
                }).catch((err) => {
                    reject(err);
                });
            })();
        });
    }
    // Perform google scraping. Returns list of Promises<Articles>
    async scrapeGoogleNews(reqTarget) {
        const keyWordsList = await this.getKeyWords();
        // const words = keyWordsList.map((w: any) => w.name);
        const words = ['invesitgation'];
        const google = new Google();
        await google.setup();
        const results = await google.scrape(words, reqTarget);
        return results;
    }
    // Login the admin
    authenticate(reqData) {
        return new Promise((resolve, reject) => {
            if (reqData.login === process.env.ADMIN_LOGIN &&
                reqData.password === process.env.ADMIN_PASSWORD) {
                const token = jwt.sign({
                    _id: process.env.ADMIN_ID
                }, process.env.TOKEN);
                resolve(token);
            }
            else {
                reject({ message: 'Wrong password' });
            }
        });
    }
}
class Google {
    NEWSCRAPER;
    LAUNCH_PUPPETEER_OPTS;
    PAGE_PUPPETEER_OPTS;
    BROWSER;
    PAGE;
    constructor() {
        this.NEWSCRAPER = newspaperjs.Article;
        this.LAUNCH_PUPPETEER_OPTS = {
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--window-size=1920x1080'
            ],
            headless: true
        };
        this.PAGE_PUPPETEER_OPTS = {
            networkIdle2Timeout: 5000,
            waitUntil: 'networkidle2',
            timeout: 60000
        };
    }
    async setup() {
        try {
            this.BROWSER = await puppeteer.launch(this.LAUNCH_PUPPETEER_OPTS);
        }
        catch (err) {
            throw new Error(err);
        }
    }
    async scrape(keywords, target) {
        try {
            const scrapeResults = [];
            for (let k = 0; k < keywords.length; k++) {
                console.log(k);
                const QUERY_STRING = encodeURIComponent(`${keywords[k]} ${target}`);
                const START = 0;
                const URL = `https://www.google.com/search?q=${QUERY_STRING}&tbm=nws&start=${START}&hl=en`;
                this.PAGE = (await this.BROWSER.pages())[0];
                await this.PAGE.setExtraHTTPHeaders({
                    'Accept-Language': 'en-US,en;q=0.9'
                });
                await this.PAGE.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');
                await this.PAGE.goto(URL, this.PAGE_PUPPETEER_OPTS);
                await this.PAGE.waitForSelector('.CEMjEf.NUnG9d');
                const googleParsingResults = await this.PAGE.evaluate(() => {
                    const $articles = Array.from(document.querySelectorAll('.SoaBEf.xuvV6b'));
                    return $articles.map(($article) => {
                        const source = $article.querySelector('.CEMjEf.NUnG9d').textContent;
                        const title = $article.querySelector('.mCBkyc.y355M.ynAwRc.MBeuO').textContent;
                        const body = $article.querySelector('.GI74Re').textContent;
                        const url = $article.querySelector('.WlydOe').getAttribute('href');
                        const date = $article.querySelector('.OSrXXb.ZE0LJd').textContent;
                        return {
                            source, title, body, url, date
                        };
                    });
                });
                const response = [];
                for (let a = 0; a < googleParsingResults.length; a++) {
                    try {
                        const article = await this.NEWSCRAPER(googleParsingResults[a].url);
                        const responseItem = googleParsingResults[a];
                        if (article)
                            responseItem.article = article;
                        response.push(responseItem);
                    }
                    catch (error) {
                        continue;
                    }
                }
                scrapeResults.push(...response);
            }
            await this.BROWSER.close();
            return scrapeResults;
        }
        catch (err) {
            throw new Error(err);
        }
    }
}
