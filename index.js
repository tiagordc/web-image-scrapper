
const program = require('commander');

program
    .version('0.0.1')
    .option('-o, --orchestrator <address>', 'main server')
    .option('-q, --query <items>', 'search query', (value, _prev) => { return value.split(','); })
    .option('-m, --model <model>', 'model')
    .option('--seed', 'seed from search engines')
    .parse(process.argv);

(async () => {

    if (program.seed) {

        const se_scraper = require('se-scraper');

        let browser_config = {
            search_engine: 'google',
            random_user_agent: true,
            is_local: false,
            html_output: false,
            throw_on_detection: false,
            headless: true,
            puppeteer_cluster_config: {
                headless: true,
                timeout: 30 * 60 * 1000,
                monitor: false,
                concurrency: 3, 
                maxConcurrency: 3
            }
        };

        let scrape_job = {
            keywords: program.query,
            num_pages: 1
        };

        var scraper = new se_scraper.ScrapeManager(browser_config);
        await scraper.start();

        for (var se of ['google', 'bing']) {
            scrape_job.search_engine = se;
            var results = await scraper.scrape(scrape_job);
            console.dir(results, {depth: null, colors: true});
        }

        await scraper.quit();

    }
    else {

        //TODO: process the next link from the queue

    }

})();
