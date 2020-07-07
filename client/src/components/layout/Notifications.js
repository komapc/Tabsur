import React, { Component } from "react";
import { connect } from "react-redux";
import menu from "../../resources/menu.svg"
import { getNotifications, markAsRead } from "../../actions/notifications";
class NoteItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
      note: this.props.note
    };
  }

  markAsRead = (note, status) => {
    note.status = status;

    markAsRead(note.id, note)
      .then(res => {
        console.log(res.data);
      }).catch(err => {
        console.log(err);
      });
  }
  render() {
    const note = this.props.note;
    return (
      <div onClick={() => this.markAsRead(note, 3)}>
        <div className="notification">{note.message_text}</div>
      </div>
    );
  }
};
class Notifications extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
      onItemClicked: this.props.onItemClicked,
      notes: []
    };
  }

  getNotifications = () => {
    getNotifications(this.props.auth.user.id)
      .then(res => {
        console.log(res.data);
        this.setState({ notes: res.data });
      }).catch(err => {
        console.log(err);
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.state.visible) {
      this.getNotifications();
    }
  }

  componentDidMount() {
    this.getNotifications();
  }

  closeMenu = () => {
    this.state.onItemClicked();
  }
  render() {
    const visible = this.props.visible;
    return (
      <div className={visible ? "notes" : "notes-hidden"}>
        <div><img className="menu-close" src={menu} onClick={this.closeMenu} alt="X" /></div>
        {this.state.notes.map(note =>
          <NoteItem key={note.id} onClick={() => this.markAsRead(note, 2)} note={note} visible={visible}></NoteItem>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,

});

export default connect(
  mapStateToProps,
)(Notifications);
