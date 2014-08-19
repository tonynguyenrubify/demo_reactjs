/** @jsx React.DOM */


var BootstrapButton = React.createClass({
  render: function() {
    // transferPropsTo() is smart enough to merge classes provided
    // to this component.
    return this.transferPropsTo(
      <a href="javascript:;" role="button" className="btn">
        {this.props.children}
      </a>
    );
  }
});

var BootstrapModal = React.createClass({
  // The following two methods are the only places we need to
  // integrate with Bootstrap or jQuery!
  componentDidMount: function() {
    // When the component is added, turn it into a modal
    $(this.getDOMNode())
      .modal({backdrop: 'static', keyboard: false, show: false})
  },
  componentWillUnmount: function() {
    $(this.getDOMNode()).off('hidden', this.handleHidden);
  },
  close: function() {
    $(this.getDOMNode()).modal('hide');
  },
  open: function() {
    $(this.getDOMNode()).modal('show');
  },
  render: function() {
    var confirmButton = null;
    var cancelButton = null;

    if (this.props.confirm) {
      confirmButton = (
        <BootstrapButton
          onClick={this.handleConfirm}
          className="btn-primary">
          {this.props.confirm}
        </BootstrapButton>
      );
    }
    if (this.props.cancel) {
      cancelButton = (
        <BootstrapButton onClick={this.handleCancel}>
          {this.props.cancel}
        </BootstrapButton>
      );
    }

    return (
      <div className="modal hide fade">
        <div className="modal-header">
          <button
            type="button"
            className="close"
            onClick={this.handleCancel}
            dangerouslySetInnerHTML={{__html: '&times'}}
          />
          <h3>{this.props.title}</h3>
        </div>
        <div className="modal-body">
          <input type="text" placeholder="Your name" ref="authorEdit" defaultValue={this.props.comment.author}/>
          <input type="text" placeholder="Say something..." ref="descriptionEdit"  defaultValue={this.props.comment.description} />
        </div>
        <div className="modal-footer">
          {cancelButton}
          {confirmButton}
        </div>
      </div>
    );
  },
  handleCancel: function() {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  },
  handleConfirm: function() {
    if (this.props.onConfirm) {
      // this.props.onConfirm();
      
      var author = this.refs.authorEdit.getDOMNode().value.trim();
      var text = this.refs.descriptionEdit.getDOMNode().value.trim();
      if (!text || !author) {
        return false;
      }
      this.props.onConfirm({book: {author: author, description: text, id: this.props.comment.id}}, this.props.comment.id);
      // this.refs.authorEdit.getDOMNode().value = '';
      // this.refs.descriptionEdit.getDOMNode().value = '';
      return false;
    }
  }
});

var TestingMenu = React.createClass({
  render: function() {
      return (
        <div>
          <a href='#listBooks'> Show List Books get form server </a> | 
          <a href='#filterSearch'> Show Filter Search demo </a>
          
        </div>
    );
  }
});

var ProductCategoryRow = React.createClass({
    render: function() {
        return (<tr><th colSpan="2">{this.props.category}</th></tr>);
    }
});

var ProductRow = React.createClass({
    render: function() {
        var name = this.props.product.stocked ?
            this.props.product.name :
            <span style={{color: 'red'}}>
                {this.props.product.name}
            </span>;
        return (
            <tr>
                <td>{name}</td>
                <td>{this.props.product.price}</td>
            </tr>
        );
    }
});

var ProductTable = React.createClass({
    render: function() {
        console.log(this.props);
        var rows = [];
        var lastCategory = null;
        this.props.products.forEach(function(product) {
            if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
                return;
            }
            if (product.category !== lastCategory) {
                rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
            }
            rows.push(<ProductRow product={product} key={product.name} />);
            lastCategory = product.category;
        }.bind(this));
        return (
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
});

var SearchBar = React.createClass({
    handleChange: function() {
        this.props.onUserInput(
            this.refs.filterTextInput.getDOMNode().value,
            this.refs.inStockOnlyInput.getDOMNode().checked
        );
    },
    render: function() {
        return (
            <form>
                <input
                    type="text"
                    placeholder="Search..."
                    value={this.props.filterText}
                    ref="filterTextInput"
                    onChange={this.handleChange}
                />
                <p>
                    <input
                        type="checkbox"
                        value={this.props.inStockOnly}
                        ref="inStockOnlyInput"
                        onChange={this.handleChange}
                    />
                    Only show products in stock
                </p>
            </form>
        );
    }
});

var FilterableProductTable = React.createClass({
    getInitialState: function() {
        return {
            filterText: '',
            inStockOnly: false
        };
    },
    
    handleUserInput: function(filterText, inStockOnly) {
        this.setState({
            filterText: filterText,
            inStockOnly: inStockOnly
        });
    },
    
    render: function() {
        return (
            <div>
                <TestingMenu />
                <SearchBar
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                    onUserInput={this.handleUserInput}
                />
                <ProductTable
                    products={this.props.products}
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                />
            </div>
        );
    }
});


var PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];
 
var converter = new Showdown.converter();
var Comment = React.createClass({
  handleCancel: function() {
    if (confirm('Are you sure you want to cancel?')) {
      this.refs.modal.close();
    }
  },
  openModal: function() {
    this.refs.modal.open();
  },

  closeModal: function(comment, id) {
    console.log(id);
    console.log(comment);
    this.props.onCommentEdit(comment, id);
    this.refs.modal.close();
  },
  
  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    var modal = null;
    modal = (
      <BootstrapModal
        comment={this.props.comment}
        ref="modal"
        confirm="OK"
        cancel="Cancel"
        onCancel={this.handleCancel}
        onConfirm={this.closeModal}
        title="Edit this content!">
      </BootstrapModal>
    );
    
    return (
      <div className="comment" >
        {modal}
        <h2 className="commentAuthor" onClick={this.openModal}>
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var _this = this;
    var commentNodes = this.props.data.map(function (comment) {
      if (comment.author.indexOf(_this.props.filterText) === -1) {
        return;
      }
      return (
        <Comment author={comment.author} comment={comment} onCommentEdit={_this.props.onCommentEdit}>
          {comment.description}
        </Comment>
      );
    }.bind(this));
    console.log(this.props);
    // var rows = [];
    // var lastCategory = null;
    // this.props.data.forEach(function(comment) {
    //     if (comment.author.indexOf(this.props.filterText) === -1) {
    //         return;
    //     }
    //     rows.push(<Comment author={comment.author}>{comment.description}</Comment>);
    // }.bind(this));
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function() {
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.description.getDOMNode().value.trim();
    if (!text || !author) {
      return false;
    }
    this.props.onCommentSubmit({book: {author: author, description: text}});
    this.refs.author.getDOMNode().value = '';
    this.refs.description.getDOMNode().value = '';
    return false;
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="description" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var SearchBar = React.createClass({
  handleChange: function() {
    this.props.onUserInput(
      this.refs.filterTextInput.getDOMNode().value
    );
  },
  render: function() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          ref="filterTextInput"
          onChange={this.handleChange}
        />
      </form>
    );
  } 
});

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  
  handleUserInput: function(filterText) {
    this.setState({filterText: filterText});
  },
  
  handleCommentSubmit: function(comment) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  
  handleCommentUpdate: function(comment, id) {
    $.ajax({
      url: "api/books/" + id,
      dataType: 'json',
      type: 'PUT',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  
  getInitialState: function() {
    return {data: [], filterText: ''};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    // setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <TestingMenu />
        <h1>Listing Books</h1>
        <SearchBar
          filterText={this.state.filterText}
          onUserInput={this.handleUserInput}
        />
        <CommentList 
          data={this.state.data}
          filterText={this.state.filterText}
          onCommentEdit={this.handleCommentUpdate}
        />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});


var Router = Backbone.Router.extend({
  routes : {
    "": "index",
    "listBooks" : "listBooks",
    "filterSearch" : "filterSearch"
  },
  
  index : function() {
    React.renderComponent(
      <CommentBox url="api/books" pollInterval={60000} />,
      document.getElementById('content')
    );
  },
  
  listBooks : function() {
    React.renderComponent(
      <CommentBox url="api/books" pollInterval={60000} />,
      document.getElementById('content')
    );
  },
  
  filterSearch : function() {
    React.renderComponent(<FilterableProductTable products={PRODUCTS} />, document.getElementById('content'));
  }
});
 
var router = new Router();
  
Backbone.history.start();

// React.renderComponent(
//   <CommentBox url="api/books" pollInterval={60000} />,
//   document.getElementById('content')
// );