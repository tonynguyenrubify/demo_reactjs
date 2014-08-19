/**
 * @jsx React.DOM
 */
var app = app || {};

(function () {
	'use strict';
	
	var TodoApp = React.createClass({		
    componentDidMount: function () {
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
      
			var Router = Backbone.Router.extend({
				routes: {
					'': 'all',
					'active': 'active',
					'completed': 'completed'
				},
				all: this.setState.bind(this, {nowShowing: app.ALL_TODOS}),
				active: this.setState.bind(this, {nowShowing: app.ACTIVE_TODOS}),
				completed: this.setState.bind(this, {nowShowing: app.COMPLETED_TODOS})
			});

			new Router();
			Backbone.history.start();

			this.props.todos.fetch();
		}
	});

	React.renderComponent(
		<TodoApp todos={app.todos} />,
		document.getElementById('content')
	);
})();
