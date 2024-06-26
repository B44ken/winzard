import requests, sys

# todo: find out what these do lol
streams = { 'fall2024': '2249' }
dbcsprds = { 'fall2024': '26' }


def fetch_course_id(c_id, dbcsprd, session_id, calendar):
    # https://student.uwindsor.ca/psc/DBCSPRD_26/EMPLOYEE/SA/c/SSR_STUDENT_FL.SSR_CLSRCH_ES_FL.GBL?Page=SSR_CLSRCH_ES_FL&SEARCH_GROUP=SSR_CLASS_SEARCH_LFF&SEARCH_TEXT=comp&ES_INST=UWIN1&ES_STRM=2249&ES_ADV=N&INVOKE_SEARCHAGAIN=PTSF_GBLSRCH_FLUID
    response = requests.get(
        f'https://student.uwindsor.ca/psc/DBCSPRD_{dbcsprds[calendar]}/EMPLOYEE/SA/c/SSR_STUDENT_FL.SSR_CRSE_INFO_FL.GBL',
        params = {
            'Page': 'SSR_CRSE_INFO_FL',
            'Action': 'U',
            'ACAD_CAREER': 'UGRD', # todo: check for grad/undergrad 
            'CRSE_ID': c_id,
            'CRSE_OFFER_NBR': '1',
            'INSTITUTION': 'UWIN1',
            'STRM': streams[calendar],
            # 'STRM': '2241'
        },
        cookies = {
            'psprdweb-PORTAL-PSJSESSIONID': session_id
        } )
    try:
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(e)
        return None


def fetch_course_search(search, session_id, calendar):

    response = requests.get(
        f'https://student.uwindsor.ca/psc/DBCSPRD_{dbcsprds[calendar]}/EMPLOYEE/SA/c/SSR_STUDENT_FL.SSR_CLSRCH_ES_FL.GBL',
        params = {
            'Page': 'SSR_CLSRCH_ES_FL',
            'SEARCH_GROUP': 'SSR_CLASS_SEARCH_LFF',
            'SEARCH_TEXT': search,
            'ES_INST': 'UWIN1',
            'ES_STRM': streams[calendar],
            'ES_ADV': 'N',
            'INVOKE_SEARCHAGAIN': 'PTSF_GBLSRCH_FLUID'
        },
        cookies = {
            'psprdweb-PORTAL-PSJSESSIONID': session_id
        } )
    try:
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(e)
        return None

if __name__ == '__main__':
    print(fetch_course_search('MATH 1730'))
