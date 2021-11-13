// pages/components/mytree/mytree.js
Component({
  properties: {
    model: Object,
  },

  data: {
    open: false,
    isBranch: false,
  },

  methods: {
    toggle: function(e) {
      if (this.data.isBranch) {
        this.setData({
          open: !this.data.open,
        })
      }
    },
    
    tapItem: function(e) {
      var path = e.currentTarget.dataset.path;
      this.triggerEvent('tapitem', { path: path, name:this.data.model.text }, { bubbles: true, composed: true });
    }
  },

  ready: function(e) {
    this.setData({
      isBranch: Boolean(this.data.model.nodes && this.data.model.nodes.length),
    });
  },
  
})