const DropdownMenuTwoLines = ({
  SvgOne,
  SvgTwo,
  nameOne,
  nameTwo,
  onClickOne,
  onClickTwo,
}) => (
  <ul className="dropdown-menu p-0" style={{ minWidth: '9rem' }}>
    <li>
      <button
        type="button"
        className="dropdown-item rounded-1"
        style={{ paddingBottom: '5px', paddingTop: '6px', paddingLeft: '12px' }}
        onClick={onClickOne}
      >
        <div className="d-flex align-items-center">
          <SvgOne className="text-danger menu-svg me-2" />
          <span>{nameOne}</span>
        </div>
      </button>
    </li>
    <li>
      <button
        type="button"
        className="dropdown-item rounded-1"
        style={{ paddingBottom: '6px', paddingTop: '5px', paddingLeft: '12px' }}
        onClick={onClickTwo}
      >
        <div className="d-flex align-items-center">
          <SvgTwo className="text-muted menu-svg me-2" />
          <span>{nameTwo}</span>
        </div>
      </button>
    </li>
  </ul>
);

export default DropdownMenuTwoLines;
