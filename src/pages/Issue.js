import React from 'react';
import { Grid, Row, Col, Pager, PageItem} from 'react-bootstrap';
import {Link } from 'react-router';

const pageSize = 10;





class ButtonLink extends React.Component{
     render(){
         const {onClick, text} = this.props;

         return <button onClick={()=>onClick()}>{text}</button>;
     }
}


export default class Issue extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          page : 0
        };
  }



  getPages(){
     const {page} = this.state;
     const {issues} = this.props;
     const numberOfPages= Math.ceil(issues.length/pageSize);
     let nextPage = page + 1 ,prevPage = page - 1;
     let firstPage = numberOfPages>0 ? 0 : -1;
     let lastPage = numberOfPages> 0 ? numberOfPages- 1 : -1;


     if(page === 0){
        prevPage = -1;
     }

     if(page === numberOfPages - 1){
        nextPage = -1;
     }
     return {
         numberOfPages,
         pages : {
             firstPage,
             currentPage : page,
             nextPage,
             prevPage,
             lastPage,
         }
     }

  }


  renderIssues() {

    const {page} = this.state;
    const {issues} = this.props;
    let upperLimit = pageSize * (page + 1);
    let lowerLimit = upperLimit - pageSize;
    let issuesInPage = issues.slice(lowerLimit, upperLimit);
    console.log(issuesInPage.length);
    return issuesInPage.map((issue) => {
        let id = issue.id;
        let labels = issue.labels.map((label, index) =>{
          let fontColor = 'black';
          if (label.name === "activerecord" || label.name === "needs work"
            || label.name === "attached PR" )
            fontColor = 'white';
          let labelKey = id + index + label.name;
          let labelStyle = {
            backgroundColor: '#'+label.color,
            color: fontColor,

          }
          return <div className="labels"><span style={labelStyle} key="labelKey"><li>{label.name}</li></span></div>;
        });
        let maxLength = 140;
        let summary = issue.body;
        summary = this.shortenSummary(summary, maxLength);
        let issueLink = "issue/"+issue.id;
        return <div className="issue" key={issue.id}>
                  <Link to={issueLink}>
                    <h3>{issue.number}:  {issue.title}</h3>
                    <p>Summary: {summary} </p>
                  </Link>
                  <ul>{labels}</ul>
                  <img src={issue.user.avatar_url}/>
                  <p className='username'>{issue.user.login}</p>
                </div>;
    });
 }

 shortenSummary(text, maxLength){
   let summary = text.substr(0, maxLength);
   summary = summary.substr(0, Math.min(summary.length, summary.lastIndexOf(" "))) + ' ...';
   return summary;
 }



 goToPage(page){
    this.setState({page});
 }

 renderPagination(){

    const page_data = this.getPages();
    console.log(page_data);
    const {numberOfPages, pages} = page_data;
    const {prevPage,nextPage, currentPage, firstPage,lastPage} = pages;

    const firstButton = firstPage > -1 ? <ButtonLink text="First" onClick={()=>this.goToPage(0)}/>  : <span/>;
    const lastButton = lastPage > -1 ? <ButtonLink text="Last" onClick={()=>this.goToPage(lastPage)}/>  : <span/>;
    const prevButton = prevPage > -1 ? <ButtonLink text="Previous" onClick={()=>this.goToPage(prevPage)}/>  : <span/>;
    const nextButton = nextPage  > -1 ? <ButtonLink text="Next" onClick={()=>this.goToPage(nextPage)}/>  : <span/>;
    const currentPageButton = <ButtonLink text={currentPage+ 1} onClick={()=>this.goToPage(currentPage)}/> ;

    return <div>
       Number of pages- {numberOfPages}

       {firstButton}{prevButton}{currentPageButton}{nextButton}{lastButton}
    </div>
 }


 render() {
    const {issues} = this.props;
    if(!issues){
      return <span/>;
    }


    const itemsPerPage = 25;
    let content = this.renderIssues();



    return (<div>{this.renderPagination()}
            <Grid>
            <Row>
             <Col xsHidden md={3} />
              <Col xs={8} md={6} >

                <div>{content}</div>

              </Col>
              <Col xsHidden md={3} />
              </Row>
            </Grid>
          {this.renderPagination()}</div>)
 }
}
