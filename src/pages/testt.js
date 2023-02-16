import React, { useEffect, useState } from 'react'
import lunr from 'lunr'

function Blogheader(props) {
  const [searchedWord, setSearchedWord] = useState(null)
  var mydocuments = [{
    "name": "Lunr",
    "text": "Like Solr, but much smaller, and not as bright."
  }, {
    "name": "React",
    "text": "A JavaScript library for building user interfaces."
  }, {
    "name": "Lodash",
    "text": "A modern JavaScript utility library delivering modularity, performance & extras."
  }]

  var idx = lunr(function () {
    this.ref('name')
    this.field('text')

    mydocuments.forEach(function (doc) {
      this.add(doc)
    }, this)
  })

  const highlightMatchedText = (text, searchTerm) => {
    const words = text.split(' ');
    return words.map((word) => {
      return word.toLowerCase().includes(searchTerm.toLowerCase()) ?
        <mark key={word} style={{color:'red'}}>{word}</mark> :
        word;
    }).reduce((acc, cur) => [...acc, ' ', cur]);
  }
const myref = React.useRef()
  return (
    <>
      <input ref={myref} onChange={(e) => {  
        const results = idx.search(e.target.value)
        setSearchedWord(results)
      }}/>

    
{searchedWord ? 
  searchedWord.map((result) => {
    console.log(searchedWord, "k", myref.current.value)
    const matchedDoc = mydocuments.find(doc => doc.name === result.ref)
    return <div key={result.ref}>
      <div>{matchedDoc.name}</div>
      <div>{highlightMatchedText(matchedDoc.text, myref.current.value)}</div>
    </div>;
  })
  : null}
    </>
  )
}

export default Blogheader