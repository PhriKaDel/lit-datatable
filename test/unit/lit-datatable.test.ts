import {
  fixture, html, expect, elementUpdated
} from '@open-wc/testing';
import sinon from 'sinon';
import type { LitDatatable, Conf } from '../../lit-datatable';
import '../../lit-datatable';

class LitDatatableTest {
  el!: LitDatatable;

  async init(conf: Array<Conf>, data: Array<unknown>, stickyHeader?: boolean): Promise<LitDatatable> {
    const litDatatable = html`
      <lit-datatable .conf="${conf}" .data="${data}" .stickyHeader="${!!stickyHeader}"></lit-datatable>
    `;
    this.el = await fixture(litDatatable);
    return this.elementUpdated();
  }

  elementUpdated(): Promise<LitDatatable> {
    return elementUpdated(this.el);
  }

  get bodyTrs() {
    if (this?.el?.shadowRoot) {
      return this.el.shadowRoot.querySelectorAll<HTMLTableRowElement>('tbody tr');
    }
    return null;
  }

  get bodyTds() {
    if (this?.el?.shadowRoot) {
      return this.el.shadowRoot.querySelectorAll<HTMLTableDataCellElement>('tbody td');
    }
    return null;
  }

  get headTrs() {
    if (this?.el?.shadowRoot) {
      return this.el.shadowRoot.querySelectorAll<HTMLTableRowElement>('thead tr');
    }
    return null;
  }

  get headThs() {
    if (this?.el?.shadowRoot) {
      return this.el.shadowRoot.querySelectorAll<HTMLTableRowElement>('thead th');
    }
    return null;
  }
}

const basicData = [
  { fruit: 'apple', color: 'green', weight: '100gr' },
  { fruit: 'banana', color: 'yellow', weight: '140gr' },
];

const basicDataWithSubObject = [
  { fruit: 'apple', color: 'green', weight: { value: '100gr' } },
  { fruit: 'banana', color: 'yellow', weight: { value: '140gr' } },
];

const basicConf: Array<Conf> = [
  { property: 'fruit', header: 'Fruit', hidden: false },
  { property: 'color', header: 'Color', hidden: false },
  { property: 'weight', header: 'Weight', hidden: false },
];

const basicConfWithSubObject: Array<Conf> = [
  { property: 'fruit', header: 'Fruit', hidden: false },
  { property: 'color', header: 'Color', hidden: false },
  { property: 'weight.value', header: 'Weight', hidden: false },
];

describe('lit-datatable', () => {
  it('counts', async () => {
    const litDatatable = new LitDatatableTest();
    await litDatatable.init(basicConf, basicData);
    await litDatatable.elementUpdated();
    const {
      bodyTrs, bodyTds, headTrs, headThs,
    } = litDatatable;
    expect(headTrs?.length).to.be.equal(1);
    expect(headThs?.length).to.be.equal(3);
    expect(bodyTrs?.length).to.be.equal(2);
    expect(bodyTds?.length).to.be.equal(6);
  });

  it('header values', async () => {
    const litDatatable = new LitDatatableTest();
    await litDatatable.init(basicConf, basicData);
    await litDatatable.elementUpdated();
    const { headThs } = litDatatable;
    expect(headThs).to.be.not.equal(null);
    if (headThs) {
      expect(headThs[0]?.textContent).to.be.equal('Fruit');
      expect(headThs[1]?.textContent).to.be.equal('Color');
      expect(headThs[2]?.textContent).to.be.equal('Weight');
    }
  });

  it('body values', async () => {
    const litDatatable = new LitDatatableTest();
    await litDatatable.init(basicConf, basicData);
    await litDatatable.elementUpdated();
    const { bodyTds } = litDatatable;
    expect(bodyTds).to.be.not.equal(null);
    if (bodyTds) {
      expect(bodyTds[0]?.textContent).to.be.equal('apple');
      expect(bodyTds[1]?.textContent).to.be.equal('green');
      expect(bodyTds[2]?.textContent).to.be.equal('100gr');
      expect(bodyTds[3]?.textContent).to.be.equal('banana');
      expect(bodyTds[4]?.textContent).to.be.equal('yellow');
      expect(bodyTds[5]?.textContent).to.be.equal('140gr');
    }
  });

  it('body values with sub object', async () => {
    const litDatatable = new LitDatatableTest();
    await litDatatable.init(basicConfWithSubObject, basicDataWithSubObject);
    await litDatatable.elementUpdated();
    const { bodyTds } = litDatatable;
    expect(bodyTds).to.be.not.equal(null);
    if (bodyTds) {
      expect(bodyTds[0]?.textContent).to.be.equal('apple');
      expect(bodyTds[1]?.textContent).to.be.equal('green');
      expect(bodyTds[2]?.textContent).to.be.equal('100gr');
      expect(bodyTds[3]?.textContent).to.be.equal('banana');
      expect(bodyTds[4]?.textContent).to.be.equal('yellow');
      expect(bodyTds[5]?.textContent).to.be.equal('140gr');
    }
  });

  it('change column position', async () => {
    const litDatatable = new LitDatatableTest();
    await litDatatable.init(basicConf, basicData);
    await litDatatable.elementUpdated();
    const { bodyTds } = litDatatable;
    expect(bodyTds).to.be.not.equal(null);
    if (bodyTds) {
      expect(bodyTds[0]?.textContent).to.be.equal('apple');
      expect(bodyTds[1]?.textContent).to.be.equal('green');
      expect(bodyTds[2]?.textContent).to.be.equal('100gr');
      expect(bodyTds[3]?.textContent).to.be.equal('banana');
      expect(bodyTds[4]?.textContent).to.be.equal('yellow');
      expect(bodyTds[5]?.textContent).to.be.equal('140gr');
    }

    const newConfPosition: Array<Conf> = [
      { property: 'weight', header: 'Weight', hidden: false },
      { property: 'color', header: 'Color', hidden: false },
      { property: 'fruit', header: 'Fruit', hidden: false },
    ];
    litDatatable.el.conf = newConfPosition;
    await litDatatable.elementUpdated();
    if (bodyTds) {
      expect(bodyTds[0]?.textContent).to.be.equal('100gr');
      expect(bodyTds[1]?.textContent).to.be.equal('green');
      expect(bodyTds[2]?.textContent).to.be.equal('apple');
      expect(bodyTds[3]?.textContent).to.be.equal('140gr');
      expect(bodyTds[4]?.textContent).to.be.equal('yellow');
      expect(bodyTds[5]?.textContent).to.be.equal('banana');
    }
  });

  it('hide column', async () => {
    const litDatatable = new LitDatatableTest();
    await litDatatable.init(basicConf, basicData);
    await litDatatable.elementUpdated();
    let bodyTrs;
    let bodyTds;
    let headTrs;
    let headThs;
    ({
      bodyTrs, bodyTds, headTrs, headThs,
    } = litDatatable);
    expect(headTrs?.length).to.be.equal(1);
    expect(headThs?.length).to.be.equal(3);
    expect(bodyTrs?.length).to.be.equal(2);
    expect(bodyTds?.length).to.be.equal(6);
    expect(bodyTds).to.be.not.equal(null);
    if (bodyTds) {
      expect(bodyTds[0]?.textContent).to.be.equal('apple');
      expect(bodyTds[1]?.textContent).to.be.equal('green');
      expect(bodyTds[2]?.textContent).to.be.equal('100gr');
      expect(bodyTds[3]?.textContent).to.be.equal('banana');
      expect(bodyTds[4]?.textContent).to.be.equal('yellow');
      expect(bodyTds[5]?.textContent).to.be.equal('140gr');
    }

    const newConf: Array<Conf> = [
      { property: 'weight', header: 'Weight', hidden: false },
      { property: 'color', header: 'Color', hidden: true },
      { property: 'fruit', header: 'Fruit', hidden: false },
    ];
    litDatatable.el.conf = newConf;
    await litDatatable.elementUpdated();
    ({
      bodyTrs, bodyTds, headTrs, headThs,
    } = litDatatable);
    expect(headTrs?.length).to.be.equal(1);
    expect(headThs?.length).to.be.equal(2);
    expect(bodyTrs?.length).to.be.equal(2);
    expect(bodyTds?.length).to.be.equal(4);
    expect(bodyTds).to.be.not.equal(null);
    if (bodyTds) {
      expect(bodyTds[0]?.textContent).to.be.equal('100gr');
      expect(bodyTds[1]?.textContent).to.be.equal('apple');
      expect(bodyTds[2]?.textContent).to.be.equal('140gr');
      expect(bodyTds[3]?.textContent).to.be.equal('banana');
    }
  });

  it('change data length', async () => {
    const litDatatable = new LitDatatableTest();
    await litDatatable.init(basicConf, basicData);
    await litDatatable.elementUpdated();
    let bodyTrs;
    let bodyTds;
    let headTrs;
    let headThs;
    ({
      bodyTrs, bodyTds, headTrs, headThs,
    } = litDatatable);
    expect(headTrs?.length).to.be.equal(1);
    expect(headThs?.length).to.be.equal(3);
    expect(bodyTrs?.length).to.be.equal(2);
    expect(bodyTds?.length).to.be.equal(6);

    // Add row
    const addRow = [
      { fruit: 'apple', color: 'green', weight: '100gr' },
      { fruit: 'banana', color: 'yellow', weight: '140gr' },
      { fruit: 'cherry', color: 'red', weight: '40gr' },
    ];
    litDatatable.el.data = addRow;
    await litDatatable.elementUpdated();

    ({
      bodyTrs, bodyTds, headTrs, headThs,
    } = litDatatable);
    expect(headTrs?.length).to.be.equal(1);
    expect(headThs?.length).to.be.equal(3);
    expect(bodyTrs?.length).to.be.equal(3);
    expect(bodyTds?.length).to.be.equal(9);

    // Delete row
    const deleteRow = [
      { fruit: 'apple', color: 'green', weight: '100gr' },
    ];
    litDatatable.el.data = deleteRow;
    await litDatatable.elementUpdated();

    ({
      bodyTrs, bodyTds, headTrs, headThs,
    } = litDatatable);
    expect(headTrs?.length).to.be.equal(1);
    expect(headThs?.length).to.be.equal(3);
    expect(bodyTrs?.length).to.be.equal(1);
    expect(bodyTds?.length).to.be.equal(3);
  });

  it('tr tap event', async () => {
    const litDatatable = new LitDatatableTest();
    await litDatatable.init(basicConf, basicData);
    await litDatatable.elementUpdated();
    const { bodyTrs } = litDatatable;
    expect(bodyTrs).to.be.not.equal(null);
    if (bodyTrs) {
      const tapEventSpy = sinon.spy();
      const tapEvent = new Event('tap');
      litDatatable.el.addEventListener('tap-tr', tapEventSpy);
      bodyTrs[0].dispatchEvent(tapEvent);
      expect(tapEventSpy.callCount).to.be.equal(1);
    }
  });

  it('tr mouseover event', async () => {
    const litDatatable = new LitDatatableTest();
    await litDatatable.init(basicConf, basicData);
    await litDatatable.elementUpdated();
    const { bodyTrs } = litDatatable;
    expect(bodyTrs).to.be.not.equal(null);
    if (bodyTrs) {
      const mouseEventSpy = sinon.spy();
      const mouseEvent = new Event('mouseover');
      litDatatable.el.addEventListener('tr-mouseover', mouseEventSpy);
      bodyTrs[0].dispatchEvent(mouseEvent);
      expect(mouseEventSpy.callCount).to.be.equal(1);
    }
  });

  it('tr mouseout event', async () => {
    const litDatatable = new LitDatatableTest();
    await litDatatable.init(basicConf, basicData);
    await litDatatable.elementUpdated();
    const { bodyTrs } = litDatatable;
    expect(bodyTrs).to.be.not.equal(null);
    if (bodyTrs) {
      const mouseEventSpy = sinon.spy();
      const mouseEvent = new Event('mouseout');
      litDatatable.el.addEventListener('tr-mouseout', mouseEventSpy);
      bodyTrs[0].dispatchEvent(mouseEvent);
      expect(mouseEventSpy.callCount).to.be.equal(1);
    }
  });

  it('sticky header', async () => {
    const litDatatable = new LitDatatableTest();
    await litDatatable.init(basicConf, basicData, true);
    await litDatatable.elementUpdated();
    const { headThs } = litDatatable;
    expect(headThs).to.be.not.equal(null);
    if (headThs) {
      const eachThIsSticky = Array.from(headThs).every((th) => th.classList.contains('sticky'));
      expect(eachThIsSticky).to.be.equal(true);
    }
  });
});
