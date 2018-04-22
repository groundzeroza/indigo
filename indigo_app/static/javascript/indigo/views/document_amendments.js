(function(exports) {
  "use strict";

  if (!exports.Indigo) exports.Indigo = {};
  Indigo = exports.Indigo;

  Indigo.SingleAmendmentView = Backbone.View.extend({
    attributes: {
      class: 'well well-sm',
    },
    template: '#amendment-editor-template',
    events: {
      'click .change-amending-work': 'changeWork',
      'click .save': 'save',
      'click .cancel': 'cancel',
    },
    bindings: {
      '.amendment-date': 'date',
    },

    initialize: function(options) {
      this.originalModel = this.model;
      this.model = this.originalModel.clone();

      this.country = options.country;
      this.listenTo(this.model, 'change', this.update);
      this.template = Handlebars.compile($(this.template).html());

      this.render();
      this.stickit();
    },

    changeWork: function() {
      var chooser = new Indigo.WorkChooserView({}),
          self = this;

      if (this.model.get('amending_uri')) {
        chooser.choose(Indigo.works.findWhere({frbr_uri: this.model.get('amending_uri')}));
      }
      chooser.setFilters({country: this.country});
      chooser.showModal().done(function(chosen) {
        if (chosen) {
          self.model.set('amending_uri', chosen.get('frbr_uri'));
          self.model.set('amending_title', chosen.get('title'));
          self.model.set('date', chosen.get('publication_date'));
        }
      });
    },

    show: function() {
      this.deferred = $.Deferred();
      return this.deferred;
    },

    update: function() {
      this.$('.amending-title').text(this.model.get('amending_title'));
      this.$('.amending-uri').text(this.model.get('amending_uri'));
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    },

    save: function() {
      this.originalModel.set(this.model.attributes);
      this.deferred.resolve();
    },

    cancel: function() {
      this.deferred.resolve();
    },
  });

  /**
   * Handle the document amendments display.
   *
   * Note that the amendments attribute of the document might
   * be changed outside of this view, in particular it could become
   * a new AmendmentList collection. That means we can't attach
   * event handlers, so the views above (and ours) must trigger
   * events on the owning document itself, not just the AmendmentList
   * collection.
   */
  Indigo.DocumentAmendmentsView = Backbone.View.extend({
    el: '.document-amendments-view',
    amendmentExpressionsTemplate: '#amendment-expressions-template',

    initialize: function() {
      this.amendmentExpressionsTemplate = Handlebars.compile($(this.amendmentExpressionsTemplate).html());

      this.model.on('change:amendments', this.render, this);
      this.model.on('change:frbr_uri', this.frbrChanged, this);

      this.listenTo(this.model.expressionSet, 'add remove reset change', this.render);
      this.listenTo(this.model.expressionSet.amendments, 'change add remove reset', this.render);
      this.listenTo(this.model, 'change:work', this.render);

      this.render();
    },

    render: function() {
      var self = this;
      var document_id = this.model.get('id');
      var dates = this.model.expressionSet.allDates(),
          pubDate = this.model.expressionSet.initialPublicationDate();

      // build up a view of amended expressions
      var amended_expressions = _.map(dates, function(date) {
        var doc = self.model.expressionSet.atDate(date);
        var info = {
          date: date,
          document: doc && doc.toJSON(),
          current: doc && doc.get('id') == document_id,
          amendments: _.map(self.model.expressionSet.amendmentsAtDate(date), function(a) {
            a = a.toJSON();
            a.work = Indigo.works.findWhere({frbr_uri: a.amending_uri});
            a.work = a.work ? a.work.toJSON() : null;
            return a;
          }),
          initial: date == pubDate,
        };
        info.linkable = info.document && !info.current;

        return info;
      });

      this.$('.amendment-expressions').html(this.amendmentExpressionsTemplate({
        amended_expressions: amended_expressions,
      }));

      // update amendment count in nav tabs
      $('.sidebar .nav .amendment-count').text(this.model.expressionSet.length <= 1 ? '' : this.model.expressionSet.length);

      $('.manage-amendments').attr('href', '/works/' + this.model.work.get('id') + '/amendments/');
    },

  });
})(window);
