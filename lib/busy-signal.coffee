BusySignalView = require './busy-signal-view'
{CompositeDisposable} = require 'atom'

module.exports = BusySignal =
  busySignalView: null
  modalPanel: null
  subscriptions: null

  activate: (state) ->
    @busySignalView = new BusySignalView(state.busySignalViewState)
    @modalPanel = atom.workspace.addModalPanel(item: @busySignalView.getElement(), visible: false)

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'busy-signal:toggle': => @toggle()

  deactivate: ->
    @modalPanel.destroy()
    @subscriptions.dispose()
    @busySignalView.destroy()

  serialize: ->
    busySignalViewState: @busySignalView.serialize()

  toggle: ->
    console.log 'BusySignal was toggled!'

    if @modalPanel.isVisible()
      @modalPanel.hide()
    else
      @modalPanel.show()
