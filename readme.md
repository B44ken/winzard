# university of windsor wizard
winzard is a course timetabler for UWindsor students. data is automatically scraped from the university website. live demo: [boratto.ca/winzard](https://boratto.ca/winzard)

## tech stack:
- go (backend api)
- mongodb (course data storage)
- python (web scrapers, parsers)
- react (frontend)

<!--
TODO UPDATE THIS

### using the uwinsite scraper demo
the demo is at `demo.py`. to run, use 
```bash
export SESSION_ID="session id"
python3 demo.py "search term"
```
on [student.uwindsor.ca](https://student.uwindsor.ca), the session id is stored in your cookies, called `psprdweb-PORTAL-PSJSESSIONID`. in chrome, the easiest way to get it is by opening the developer tools, going to the application tab, then cookies, then student.uwindsor.ca, then copying the entry for `psprdweb-PORTAL-PSJSESSIONID`.
-->
