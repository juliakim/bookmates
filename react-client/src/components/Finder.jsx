import React, { Component } from 'react';
import { Button, Divider, Input, List, Select, Typography, Avatar, Icon } from 'antd';
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
    {text}
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
      .then(({ data }) => {
        if (data === 'Successfully added book to bookshelf') {
          this.props.showAlert('success', 'Successfully added to bookshelf!');
        }
        if (data === 'Book is already a part of bookcase') {
          this.props.showAlert('info', 'Book is already on bookshelf!');
        }
        this.props.updateBookshelf()
      })
      .catch(() => this.props.showAlert('error', 'Could not add to bookshelf'));
  }

  addToFavorites(e) {
    let { title, authors, publishedDate, description, pageCount, categories, imageLinks, previewLink } = e.volumeInfo
    authors = authors.join(', ');
    imageLinks = imageLinks.smallThumbnail;
    const ISBN13 = getISBN13(e.volumeInfo.industryIdentifiers);
    axios.post('/favorites', {
      title: title,
      authors: authors,
      publishedDate: publishedDate,
      description: description,
      pageCount: pageCount,
      imageLinks: imageLinks,
      previewLink: previewLink,
      ISBN13: ISBN13
    })
      .then(({ data }) => {
        if (data === 'Successfully added book to favorites') {
          this.props.showAlert('success', 'Successfully added to favorites!');
        }
        if (data === 'Book is already a part of favorites') {
          this.props.showAlert('info', 'Book is already saved to favorites!');
        }
        this.props.updateFavorites();
        this.props.updateBookshelf();
      })
      .catch(() => this.props.showAlert('error', 'Could not add to bookshelf')); // add alertt
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
      <div style={{ background: '#fff', padding: 24, minHeight: 1180 }}>
        <Title level={2}>Search</Title>
        <Divider />
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
                <div>
                  <Button type="link" onClick={() => this.addToBookshelf(book)}>
                    <IconText type="plus" text={'Add to bookshelf'} key="list-vertical-plus"/>
                  </Button>
                  <Button type="link" onClick={() => this.addToFavorites(book)}>
                    <IconText type="star-o" text={'Add to favorites'} key="list-vertical-star-o"/>
                  </Button>
                </div>
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