import fetch, { Headers } from 'node-fetch';

const today = new Date();

// days back;
const daysBack = 4;
today.setDate(today.getDate() - daysBack);

const formattedToday = today.toISOString();

const cookies = "_octo=GH1.1.1767048358.1699270869; _device_id=d64a163cd62e8fe92c92cea30ae8f768; saved_user_sessions=147155118%3AN0lITeWsc0uUDB_I1_sMa5OLa1iQGWpwge9QG0PyWWvhUvnm; user_session=N0lITeWsc0uUDB_I1_sMa5OLa1iQGWpwge9QG0PyWWvhUvnm; __Host-user_session_same_site=N0lITeWsc0uUDB_I1_sMa5OLa1iQGWpwge9QG0PyWWvhUvnm; logged_in=yes; dotcom_user=reshaeel-saif; color_mode=%7B%22color_mode%22%3A%22auto%22%2C%22light_theme%22%3A%7B%22name%22%3A%22light%22%2C%22color_mode%22%3A%22light%22%7D%2C%22dark_theme%22%3A%7B%22name%22%3A%22dark%22%2C%22color_mode%22%3A%22dark%22%7D%7D; preferred_color_mode=light; tz=Asia%2FKarachi; has_recent_activity=1; _gh_sess=NGYuEXwqoBbpWwQ9Bk4Wk3DELjj9p7m5oYGHxhEyYbJxd8JNux7%2B04B833ayR7Ivm73S102j3eGdaT2QRI1xRyaLXC5Ae8MONfO3EvZwOXNOzs3aWXpHJLM1keinX2rXg%2BE9qedBe0ju33U9jPI%2BOqC9YvhduKMEbrrVuAxs%2B9DIWkxREhKmx4kwaf30ETQPzBe0kUPQNs8JdQhPk2Pjt6dWomPgnkqrfogTLvt7x7uTOefTsWpdmyrvv%2FqYYqwYuX06MPwSdK%2F05SBIWtZ4K3bqJFTE3eofgL2g%2F7J7rNUHs8cdBFjoqQ94b1cHasqKi5u514HpoUzxzKsl%2BN5UQXYnDqQfmFqpcAvBs5%2FC%2BRod9xr4qaKywo5%2B11PE9G9EoZJXji092xCTjRVmWq23h%2FgcqP0%3D--kKPP89f2GX2nK8qq--7BIzGj3CQ5244fpkj8mgGg%3D%3D; _gh_sess=zw2%2FaM%2F5EjwZj5ZU7u%2FmdP0tul45TSAyyDmTUIytmsRdZaZGVbLDOGWQ4tRvP6hH2hrg4KKZ%2FPGMWy3L7paH0eB1udXs8ez5NqTCypNOAkXBj3jnvqRVWPaL%2B7pYQ1d%2FCPCnGBHrXOpQvk6MpwD9STGybWbMxl6ZpiOAbkr1roivXRApg3Ip8hbkKeKEnINTK2dtHXQVjMbrrBFHoYlkm1mJtGLHxYZhgEvpqxwp0jalYXCFzeQmaDYt%2FqnD5NS8PjQYJRBdqUKUizsj6MtkN7I15CBhfzF5KOGDcShRdw90LQKND%2BqCOY%2FtAY2KNC%2FwDtQIn6p%2BFiro3jJrPfezgMr9mH2OPa%2BXu8kHyLl0MxhePGViQ%2Fe556S2%2BPgi9eqFMSQ87BA%2Blz4Cl0rfsz75b05q3OA%3D--Rin3YMp41oLgdi0o--hxe0Aq12ZsYMU%2FzhwmHDHg%3D%3D; _octo=GH1.1.497635993.1706263024; has_recent_activity=1; logged_in=no"


// API TO FETCH ALL BRANCHES
const myHeaders = new Headers();
myHeaders.append("authority", "github.com");
myHeaders.append("accept", "application/json");
myHeaders.append("accept-language", "en-US,en;q=0.9");
myHeaders.append("cookie", cookies);

const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};

fetch("https://github.com/SyedShaheer34/piqosity_angular/branches/all", requestOptions)
    .then(response => response.text())
    .then(async data => {
        let branches = JSON.parse(data).payload.branches;

        const filteredBranches = branches.filter(branch => {
            const authoredDate = new Date(branch.authoredDate);
            return (
                branch.author.name === 'reshaeel-saif' &&
                authoredDate.getDate() === today.getDate() &&
                authoredDate.getMonth() === today.getMonth() &&
                authoredDate.getFullYear() === today.getFullYear()
            );
        });

        const allBranches = [];
        for (let branch of filteredBranches) {

            const myHeaders = new Headers();
            myHeaders.append("authority", "github.com");
            myHeaders.append("accept", "application/json");
            myHeaders.append("accept-language", "en-US,en;q=0.9");
            myHeaders.append("content-type", "application/json");
            myHeaders.append("cookie", cookies);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            // API TO FETCH COMMITS AGAINST A SPECIFIC BRANCH WITH FILTERS
            await fetch(`https://github.com/SyedShaheer34/piqosity_angular/commits/deferred_commit_data/${branch.name}?author=reshaeel-saif&original_branch=${branch.name}&since=${formattedToday}&until=${formattedToday}`, requestOptions)
                .then(response => response.text())
                .then(result => {
                    const separateData = JSON.parse(result);

                    for (let commit of separateData.deferredCommits) {
                        allBranches.push('https://github.com/SyedShaheer34/piqosity_angular/commit/' + commit.oid);
                    }

                })
                .catch(error => console.log('error', error));
        }
        const finalData = Array.from(new Set(allBranches));
        for (let commit of finalData) {
            console.log(commit);
        }
    })
    .then(() => console.log('Data written to output.json'))
    .catch(error => console.log('error', error));