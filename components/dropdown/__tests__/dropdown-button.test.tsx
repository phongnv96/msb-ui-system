import React from 'react';
import DropdownButton from '../dropdown-button';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import Menu from '../../menu';
import type { DropdownProps } from '../dropdown';
import { render } from '../../../tests/utils';

let dropdownProps: DropdownProps;
jest.mock('../dropdown', () => {
  const ActualDropdown = jest.requireActual('../dropdown');
  const ActualDropdownComponent = ActualDropdown.default;
  const h: typeof React = jest.requireActual('react');

  const mockedDropdown = (props: DropdownProps) => {
    dropdownProps = props;
    const { children, ...restProps } = props;
    return h.createElement(ActualDropdownComponent, { ...restProps }, children);
  };
  mockedDropdown.defaultProps = ActualDropdownComponent.defaultProps;
  mockedDropdown.Button = ActualDropdownComponent.Button;

  return {
    ...ActualDropdown,
    __esModule: true,
    default: mockedDropdown,
  };
});

describe('DropdownButton', () => {
  mountTest(DropdownButton);
  rtlTest(DropdownButton);

  it('pass appropriate props to Dropdown', () => {
    const props: DropdownProps = {
      align: {
        offset: [10, 20],
      },
      overlay: (
        <Menu>
          <Menu.Item key="1">foo</Menu.Item>
        </Menu>
      ),
      disabled: false,
      trigger: ['hover'],
      visible: true,
      onVisibleChange: () => {},
    };

    render(<DropdownButton {...props} />);

    Object.keys(props).forEach((key: keyof DropdownProps) => {
      expect(dropdownProps[key]).toBe(props[key]);
    });
  });

  it("don't pass visible to Dropdown if it's not exits", () => {
    const menu = (
      <Menu>
        <Menu.Item key="1">foo</Menu.Item>
      </Menu>
    );
    render(<DropdownButton overlay={menu} />);
    expect('visible' in dropdownProps).toBe(false);
  });

  it('should support href like Button', () => {
    const menu = (
      <Menu>
        <Menu.Item key="1">foo</Menu.Item>
      </Menu>
    );
    const { asFragment } = render(<DropdownButton overlay={menu} href="https://ant.design" />);
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('have static property for type detecting', () => {
    expect(DropdownButton.__ANT_BUTTON).toBe(true);
  });

  it('should pass mouseEnterDelay and mouseLeaveDelay to Dropdown', () => {
    const menu = (
      <Menu>
        <Menu.Item key="1">foo</Menu.Item>
      </Menu>
    );
    render(<DropdownButton mouseEnterDelay={1} mouseLeaveDelay={2} overlay={menu} />);
    expect(dropdownProps.mouseEnterDelay).toBe(1);
    expect(dropdownProps.mouseLeaveDelay).toBe(2);
  });

  it('should support overlayClassName and overlayStyle', () => {
    const menu = (
      <Menu>
        <Menu.Item key="1">foo</Menu.Item>
      </Menu>
    );
    const { container } = render(
      <DropdownButton
        overlayClassName="className"
        overlayStyle={{ color: 'red' }}
        overlay={menu}
        visible
      />,
    );
    expect(container.querySelector('.ant-dropdown')?.classList).toContain('className');
    expect((container.querySelector('.ant-dropdown') as HTMLElement).style.color).toContain('red');
  });

  it('should support loading', () => {
    const { container } = render(<DropdownButton overlay={<div />} loading />);

    expect(container.querySelector('.ant-dropdown-button .ant-btn-loading')?.classList).toContain(
      'ant-btn',
    );
  });
});
