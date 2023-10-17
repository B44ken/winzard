# university of windsor wizard
completely a work in progress, i have absolutely no direction whatsoever here, yadda yadda

### using the uwinsite scraper
the demo is at `demo.py`. to run, use 
```bash
python3 demo.py id="your session id" search="search term"
```
the session id is stored in your cookies, called `psprdweb-PORTAL-PSJSESSIONID`. in chrome, the easiest way to get it is by opening the developer tools, going to the application tab, then cookies, then student.uwindsor.ca, then copying the entry for `psprdweb-PORTAL-PSJSESSIONID`.
