import MiniSearch from 'minisearch'

const documents = [
    {
      id: 1,
      title: 'Moby Dick',
      text: 'Call me Ishmael. Some years ago...',
      category: 'fiction'
    },
    {
      id: 2,
      title: 'Zen and the Art of Motorcycle Maintenance',
      text: 'I can see by my watch...',
      category: 'fiction'
    },
    {
      id: 3,
      title: 'Neuromancer',
      text: 'The sky above the port was...',
      category: 'fiction'
    },
    {
      id: 4,
      title: 'Zen and the Art of Archery',
      text: 'At first sight it must seem...',
      category: 'non-fiction'
    },
    // ...and more
  ]

  
let miniSearch = new MiniSearch({
    fields: ['title', 'text'], // fields to index for full-text search
    storeFields: ['title', 'category'], // fields to return with search results
    searchOptions: {
        fuzzy: 0.25
    }
})

miniSearch.addAll(documents)
// Search with default options
let results = miniSearch.search('zen art motorcycle')
console.log("first", results)





