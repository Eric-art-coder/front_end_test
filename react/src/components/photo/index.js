import React from 'react';
import { connect } from 'react-redux';

import Http from './Http';
import {
  photoTypes, PHOTO_CONDITION, PHOTO_PAGINATION
} from './types';
import {
  NavBar,
  SubNavBar,
  DragRefresher,
  PullRefresher,
  PhotoItem
} from './components';

export class Photo extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.resetPhotos(this.props.classDetail.id, photoTypes[0].id);
  }

  //1. 切换班级触发点
  componentWillReceiveProps(nextProps) {
    if(this.props.classDetail.id !== nextProps.classDetail.id) {
      this.resetPhotos(nextProps.classDetail.id);
    }
  }

  //2. 切换类型触发点
  choosePhotoType = photoTypeId => {
    this.resetPhotos(null, photoTypeId);
  }

  //3. "下拉刷新"触发点
  refreshPhotos = () => {
    this.getPhotos(true, { pageIndex: 1 }).then(() => {
      this.DragRefresherComponent.complete();
    });
  }

  //4. "分页加载"触发点
  loadMorePhotos = () => {
    this.getPhotos(false, {
      pageIndex: this.props.condition.pageIndex + 1
    });
  }

  resetPhotos(classId, photoTypeId) {
    const condition = {
      pageIndex: 1,
      pageSize: 10
    };

    if(classId) {
      condition.classId = classId;
    }

    if(photoTypeId) {
      condition.photoTypeId = photoTypeId;
    }

    this.props.dispatch({
      type: PHOTO_CONDITION,
      data: condition
    });
    this.props.dispatch({
      type: PHOTO_PAGINATION,
      list: null,
      totalPage: 0
    });
    this.getPhotos(true);
  }

  async getPhotos(resetPaginationList, conditionToUpdate) {
    const condition = Object.assign({}, this.props.condition, conditionToUpdate);
    const result = await Http.post('GET_CLASS_PHOTOS', condition);
    const list = resetPaginationList ? [] : this.props.pagination.list;
    this.props.dispatch({
      type: PHOTO_PAGINATION,
      list: list.concat(result.data.list),
      totalPage: result.data.totalPage
    });

    if(typeof conditionToUpdate !== 'undefined') {
      this.props.dispatch({
        type: PHOTO_CONDITION,
        data: conditionToUpdate
      });
    }

    this.PullRefresherComponent.reset();
  }

  render() {
    const { condition, pagination } = this.props;
    const PhotoItems = pagination.list ? pagination.list.map(item => (
      <PhotoItem key={ item.id } { ...item } />
    )) : null;

    return (
      <div className="container">
        <NavBar />
        <SubNavBar
          photoTypes={ photoTypes }
          activePhotoTypeId={ condition.photoTypeId }
          onChoose={ this.choosePhotoType }
        />
        <div className="photo-view">
          <DragRefresher
            onRefresh={ this.refreshPhotos }
            ref={ comp => this.DragRefresherComponent = comp }
          />
          <div className="photo-items">
            { PhotoItems }
          </div>
          <PullRefresher
            onRefresh={ this.loadMorePhotos }
            disabled={ condition.pageIndex >= pagination.totalPage }
            ref={ comp => this.PullRefresherComponent = comp }
          />
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  classDetail: state.classDetail,
  condition: state.photoCondition,
  pagination: state.photoPagination
}))(Photo)
