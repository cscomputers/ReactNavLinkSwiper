import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Skeleton from 'react-loading-skeleton';

import style from './style.scss';

const FAKE_ITEMS = ['', ''];
const SCROLL_DEBOUNCE = 50;
const INITIAL_POS = 28;

export class NavLinkSwiper extends React.Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.state = {
      selectedIndex: props.selectedIndex || 0,
    };
  }

  componentDidMount() {
    this.initialScrollPosition();
  }

  initialScrollPosition() {
    if (!this.container.current) return;

    let position;
    const { selectedIndex } = this.props;
    if (selectedIndex === 0) {
      position = INITIAL_POS;
    } else {
      position = this.container.current.childNodes[selectedIndex].offsetLeft;
    }
    this.container.current.scroll(position, 0);
  }

  getItemWidth() {
    const TOTAL_FAKE_ITEMS = FAKE_ITEMS.length + FAKE_ITEMS.length;
    const items = this.props.linkArray.length;
    const { scrollWidth } = this.container.current;

    return scrollWidth / (items + TOTAL_FAKE_ITEMS);
  }

  centrilizeScrollPosition() {
    const itemWidth = this.getItemWidth();
    const { scrollLeft } = this.container.current;
    const screenIndex = this.state.selectedIndex - FAKE_ITEMS.length;
    const expectedScroll = Math.floor(screenIndex * itemWidth);

    if (expectedScroll !== scrollLeft) {
      this.fluidScroll({ scrollLeft, expectedScroll });
    }
  }

  getIncreaserValue({ expectedScroll }) {
    const { scrollLeft } = this.container.current;
    const diff = Math.abs(expectedScroll - scrollLeft);
    const TINY_SCROLL = 0;
    const TEN_PERCENT = 0.1;
    const BIG_SCROLL = diff * TEN_PERCENT;
    const isTinyScroll = BIG_SCROLL > diff || BIG_SCROLL < TINY_SCROLL;
    const value = isTinyScroll ? TINY_SCROLL : BIG_SCROLL;
    const isScrollToRight = expectedScroll > scrollLeft;
    return isScrollToRight ? value : value * -1;
  }

  fluidScroll({ scrollLeft, expectedScroll }) {
    this.container.current.scrollLeft += this.getIncreaserValue({ expectedScroll });
  }

  updateSelectedItem = _.debounce(selectedIndex => {
    if (this.state.selectedIndex !== selectedIndex) {
      this.props.beforeChange(selectedIndex - FAKE_ITEMS.length);
    }
    this.setState({ selectedIndex });
    this.centrilizeScrollPosition();
  }, SCROLL_DEBOUNCE);

  getCenterIndex() {
    const HALF = 2;
    const itemWidth = this.getItemWidth();
    const { scrollLeft, clientWidth } = this.container.current;

    const MAX_ITENS_ON_SCREEN = clientWidth / itemWidth;
    const CENTER_ELEMENT = Math.floor(MAX_ITENS_ON_SCREEN / HALF);
    const centerPosition = itemWidth * CENTER_ELEMENT + scrollLeft;

    return Math.round(centerPosition / itemWidth);
  }

  onContainerScroll = event => {
    const centerIndex = this.getCenterIndex();
    this.updateSelectedItem(centerIndex);
  };

  onItemClick = event => {
    const index = Number(event.target.dataset.value);
    if (!this.isFakeIndex(index)) {
      const indexPosition = index - FAKE_ITEMS.length;
      this.props.beforeChange(indexPosition);
      this.setState({ selectedIndex: index });
      const textPosition = this.container.current.childNodes[indexPosition].offsetLeft;
      this.container.current.scroll(textPosition, 0);
    }
  };

  isFakeIndex(index) {
    const minIndex = FAKE_ITEMS.length;
    const maxIndex = this.props.linkArray.length + FAKE_ITEMS.length;

    return index < minIndex || index >= maxIndex;
  }

  render() {
    const { selectedIndex } = this.state;
    const { linkArray, isLoading } = this.props;

    if (isLoading) return <Skeleton />;
    const listWithFakeItems = [...FAKE_ITEMS, ...linkArray, ...FAKE_ITEMS];
    return (
      <div className='bg-white'>
        <div className={style.container} onScroll={this.onContainerScroll} ref={this.container}>
          {listWithFakeItems.map((value, index) => {
            const isSelectedItem = index === selectedIndex;
            const itemStyle = classnames(style.item, { [style.selectedItem]: isSelectedItem });

            return (
              <div key={index} data-value={index} className={itemStyle} onClick={this.onItemClick}>
                {value}
              </div>
            );
          })}
        </div>
        <hr className={`${style.line}`} />
      </div>
    );
  }
}

NavLinkSwiper.propTypes = {
  linkArray: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  selectedIndex: PropTypes.number.isRequired,
  beforeChange: PropTypes.func.isRequired,
};
