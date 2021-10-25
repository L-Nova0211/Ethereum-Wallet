import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

export default class Instruction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      message: props.message
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.message !== prevProps.message) {
      this.setState({message: this.props.message});
      this.onOpenModal();
    }
  }

  onOpenModal = () => {
    this.setState({open: true});
  };

  onCloseModal = () => {
    this.setState({open: false});
  };

  render() {
    const { open, message } = this.state;

    return (
      <div>
        <Modal open={open} onClose={this.onCloseModal} center>
          <div className="react-modal-content">
            <p>{message}</p>
          </div>
        </Modal>
      </div>
    )
  }
}
