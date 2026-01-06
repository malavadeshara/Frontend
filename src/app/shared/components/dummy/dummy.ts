import { Component } from '@angular/core';

@Component({
  selector: 'app-dummy',
  template: `
    <div class="card p-4 shadow-sm">
      <h4>Page Content Area</h4>
      <p>This content changes, navbar & footer stay.</p>
    </div>
  `
})
export class DummyComponent {}