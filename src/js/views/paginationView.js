import View from './view.js';
import icons from 'url:../../img/icons.svg'; //! parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const gotoPage = +btn.dataset.goto;
      handler(gotoPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );

    // todo page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupButton('next', curPage);
    }

    // todo last page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupButton('prev', curPage);
    }
    // todo other page
    if (curPage < numPages) {
      return this._generateMarkupButton('both', curPage);
    }

    // todo page 1, and there are no other pages
    return '';
  }

  _generateMarkupButton(type, curPage) {
    const nextButton = `  <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
       <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;

    const prevButton = `<button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>`;

    if (type === 'next') return nextButton;
    if (type === 'prev') return prevButton;
    if (type === 'both') return prevButton + nextButton;
  }
}

export default new PaginationView();
