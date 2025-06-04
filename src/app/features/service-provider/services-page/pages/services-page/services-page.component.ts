import { Component } from '@angular/core';

import {
  ColDef,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import { ServicesPage } from '../../models/Services-page';
import { ServicesPageService } from '../../services/service-page/services-page.service';
import { ActiveToggleRendererComponent } from '../../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';


@Component({
  selector: 'app-services-page',
  standalone: false,
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.css',
})
export class ServicesPageComponent {
  rows: ServicesPage[] = [];
  private gridApi!: GridApi;
  toggleOptions = false;

  ActiveToggleRendererComponent = ActiveToggleRendererComponent;

     columnDefs: ColDef<ServicesPage>[] = [
    {
      field: 'Description',
      headerName: 'Description',
      sortable: true,
      flex: 2,
      minWidth: 200,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'ServiceType',
      headerName: 'Service Type',
      sortable: true,
      flex: 1,
      maxWidth: 150,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'Note',
      headerName: 'Note',
      sortable: true,
      flex: 1,
      minWidth: 180,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'NotePlain',
      headerName: 'Note Plain',
      flex: 1,
      minWidth: 120,
      cellStyle: {borderRight: '1px solid #ccc'},
      headerClass: 'bold-header',
    },
    {
      field: 'EnforceMobileNumber',
      headerName: 'Enforce Mobile #',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const imagePath = params.value
          ? 'assets/icons/tick.png'
          : 'assets/icons/cross.png';
        return `<img src="${imagePath}" alt="${
          params.value ? 'Yes' : 'No'
        }" style="width: 20px; height: 20px;" />`;
      },
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'SendRefSMSEnabled',
      headerName: 'Send Ref SMS',
      flex: 1,
      minWidth: 140,
      cellRenderer: (params: any) => {
        const imagePath = params.value
          ? 'assets/icons/tick.png'
          : 'assets/icons/cross.png';
        return `<img src="${imagePath}" alt="${
          params.value ? 'Yes' : 'No'
        }" style="width: 20px; height: 20px;" />`;
      },
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'IsActive',
      headerName: 'Active',
      flex: 1,
      minWidth: 120,
      cellRenderer: 'activeToggleRenderer',
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  constructor(private spSvc: ServicesPageService) {}

  ngOnInit(): void {
    this.spSvc.getAll().subscribe((data) => {
      this.rows = data;
      setTimeout(() => this.autoSizeColumnsBasedOnContent(), 0);
    });
  }

  onGridReady(e: GridReadyEvent) {
    this.gridApi = e.api;
    this.autoSizeColumnsBasedOnContent();
  }

  onFitColumns() {
    if (!this.gridApi) return;

    const allColDefs = this.gridApi.getColumnDefs() ?? [];

    const allColumnFields = allColDefs
      .filter((colDef): colDef is ColDef => (colDef as ColDef).field !== undefined)
      .map((colDef) => (colDef as ColDef).field!)
      .filter((field) => field !== undefined);

    const columnsToFit = allColumnFields.filter(
      (field) =>
        ![
          'Description',
          'ServiceType',
          'Note',
          'NotePlain',
          'EnforceMobileNumber',
          'SendRefSMSEnabled',
          'IsActive',
        ].includes(field)
    );

    if (columnsToFit.length) {
      this.gridApi.autoSizeColumns(columnsToFit, false);
    }
  }

  autoSizeColumnsBasedOnContent() {
    if (!this.gridApi) return;

    const columnsToAutoSize = [
      'Description',
      'ServiceType',
      'Note',
      'NotePlain',
      'EnforceMobileNumber',
      'SendRefSMSEnabled',
      'IsActive',
    ];
    this.gridApi.autoSizeColumns(columnsToAutoSize, false);
  }

  openPopup(service: ServicesPage): void {
    this.toggleOptions = false;
    // Your popup logic here
  }
}