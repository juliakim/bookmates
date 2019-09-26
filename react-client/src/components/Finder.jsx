import React, { Component } from 'react';
import { Button, Input, List, Select, Typography, Avatar, Icon } from 'antd';
import apiKey from '../../env/config.js';
import axios from 'axios';

const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

let searchSelect = 'title';

const handleChange = (value) => {
  searchSelect = value;
}

const parseSearch = (string) => {
  return string.split(' ').join('+')
}

const parseResults = (array) => {
  for (let i = 0; i < array.length; i++) {
    if (!array[i].id) {
      array[i].id = i;
    }
    if (!array[i].volumeInfo) {
      array[i].volumeInfo = {};
    }
    if (!array[i].volumeInfo.title) {
      array[i].volumeInfo.title = '';
    }
    if (!array[i].volumeInfo.authors) {
      array[i].volumeInfo.authors = [];
    }
    if (!array[i].volumeInfo.publishedDate) {
      array[i].volumeInfo.publishedDate = 0;
    }
    if (!array[i].volumeInfo.description) {
      array[i].volumeInfo.description = 'Description unavailable';
    }
    if (!array[i].volumeInfo.pageCount) {
      array[i].volumeInfo.pageCount = 0;
    }
    if (!array[i].volumeInfo.categories) {
      array[i].volumeInfo.categories = [];
    }
    if (!array[i].volumeInfo.imageLinks) {
      array[i].volumeInfo.imageLinks = {}
    }
    if (!array[i].volumeInfo.imageLinks.smallThumbnail) {
      array[i].volumeInfo.imageLinks.smallThumbnail = 'https://islandpress.org/sites/default/files/400px%20x%20600px-r01BookNotPictured.jpg';
    }
    if (!array[i].volumeInfo.previewLink) {
      array[i].volumeInfo.previewLink = 'http://amazon.com';
    }
  }
};

const getISBN13 = (array) => {
  if (!array) {
    return null;
  }
  for (let i = 0; i < array.length; i++) {
    if (array[i].type === 'ISBN_13') {
      return array[i].identifier;
    }
  }
  return null;
};

const select = (
  <Select defaultValue="title" style={{ width: 90 }} onChange={handleChange}>
    <Option value="title">Title</Option>
    <Option value="author">Author</Option>
  </Select>
);

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {'Add to bookshelf'}
  </span>
);

class Finder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchSelect: searchSelect,
      searchQuery: '',
      searchResults: []
    };
    this.addToBookshelf = this.addToBookshelf.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  addToBookshelf(e) {
    let { title, authors, publishedDate, description, pageCount, categories, imageLinks, previewLink } = e.volumeInfo
    authors = authors.join(', ');
    imageLinks = imageLinks.smallThumbnail;
    const ISBN13 = getISBN13(e.volumeInfo.industryIdentifiers);
    axios.post('/books', {
      title: title,
      authors: authors,
      publishedDate: publishedDate,
      description: description,
      pageCount: pageCount,
      imageLinks: imageLinks,
      previewLink: previewLink,
      ISBN13: ISBN13
    })
      .then(response => console.log(response))
      .catch(error => 'Could not add book to favorites'); // add alertt
  }

  handleSearch(value) {
    value = parseSearch(value);
    const url = `https://www.googleapis.com/books/v1/volumes?q=in${this.state.searchSelect}:${value}&maxResults=40&fields=items(id,volumeInfo/title,volumeInfo/authors,volumeInfo/publishedDate,volumeInfo/description,volumeInfo/industryIdentifiers,volumeInfo/pageCount,volumeInfo/categories,volumeInfo/imageLinks,volumeInfo/previewLink)&key=${apiKey}`;
    axios.get(url)
      .then(({ data }) => {
        parseResults(data.items);
        this.setState({searchResults: data.items});
      })
      .catch(error => console.log('Error', error))
  }

  render() {
    return (
      <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
        <Title level={2}>Search</Title>
        <Search addonBefore={select} placeholder="Find book" onSearch={this.handleSearch} enterButton/>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{pageSize: 5}}
          dataSource={this.state.searchResults}
          renderItem={book => (
            <List.Item
              key={book.id}
              actions={[
                <Button type="link" onClick={() => this.addToBookshelf(book)}>
                  <IconText type="plus" key="list-vertical-plus"/>
                </Button>
                // <IconText type="star-o" key="list-vertical-star-o"/>
                // <IconText type="like-o" text="156" key="list-vertical-like-o" />,
                // <IconText type="message" text="2" key="list-vertical-message" />,
              ]}
              extra={
                <img
                  width={'128px'}
                  alt="cover"
                  src={book.volumeInfo.imageLinks.smallThumbnail}
                />
              }
            >
              <List.Item.Meta
                title={<a href={book.volumeInfo.previewLink}>{book.volumeInfo.title}</a>}
                description={book.volumeInfo.authors.join(', ')}
              />
              <Paragraph ellipsis={{ rows: 3, expandable: true }}>
                {book.volumeInfo.description}
              </Paragraph>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default Finder;