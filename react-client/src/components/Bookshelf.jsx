import React from 'react';
import { Button, Icon, List, Typography } from 'antd';

const { Title, Paragraph } = Typography;

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
  return array;
};

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

const Bookshelf = (props) => {
  return (
    <div style={{ background: '#fff', padding: 24, minHeight: 400 }}>
      <Title level={2}>Bookshelf</Title>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{pageSize: 5}}
        dataSource={parseResults(props.bookshelf)}
        renderItem={book => (
          <List.Item
            key={book.id}
            actions={[
              <div>
                <Button type="link" onClick={() => props.addToFavorites(book)}>
                  <IconText type="star-o" text={'Add to favorites'} key="list-vertical-star-o"/>
                </Button>
                <Button type="link" onClick={() => props.removeFromBookshelf(book)}>
                  <IconText type="delete" text={'Remove from bookshelf'} key="list-vertical-delete"/>
                </Button>
              </div>
              // <IconText type="like-o" text="156" key="list-vertical-like-o" />,
              // <IconText type="message" text="2" key="list-vertical-message" />,
            ]}
            extra={
              <img
                width={'128px'}
                alt="cover"
                src={book.imageLinks}
              />
            }
          >
            <List.Item.Meta
              title={<a href={book.previewLink}>{book.title}</a>}
              description={book.authors}
            />
            <Paragraph ellipsis={{ rows: 3, expandable: true }}>
              {book.description}
            </Paragraph>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Bookshelf;