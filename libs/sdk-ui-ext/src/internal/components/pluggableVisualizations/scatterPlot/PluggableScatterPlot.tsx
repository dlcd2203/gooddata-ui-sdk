// (C) 2019 GoodData Corporation
import { VisualizationTypes } from "@gooddata/sdk-ui";
import * as React from "react";
import { render } from "react-dom";
import { BUCKETS } from "../../../constants/bucket";
import { SCATTERPLOT_SUPPORTED_PROPERTIES } from "../../../constants/supportedProperties";
import { DEFAULT_SCATTERPLOT_UICONFIG } from "../../../constants/uiConfig";
import { IExtendedReferencePoint, IReferencePoint, IVisConstruct } from "../../../interfaces/Visualization";
import { configureOverTimeComparison, configurePercent } from "../../../utils/bucketConfig";

import {
    removeAllArithmeticMeasuresFromDerived,
    removeAllDerivedMeasures,
    sanitizeFilters,
} from "../../../utils/bucketHelper";
import { getReferencePointWithSupportedProperties } from "../../../utils/propertiesHelper";
import { removeSort } from "../../../utils/sort";
import { setScatterPlotUiConfig } from "../../../utils/uiConfigHelpers/scatterPlotUiConfigHelper";
import ScatterPlotConfigurationPanel from "../../configurationPanels/ScatterPlotConfigurationPanel";
import { PluggableBaseChart } from "../baseChart/PluggableBaseChart";
import { IInsightDefinition } from "@gooddata/sdk-model";
import { transformBuckets } from "./bucketHelper";
import cloneDeep = require("lodash/cloneDeep");
import { SettingCatalog } from "@gooddata/sdk-backend-spi";

export class PluggableScatterPlot extends PluggableBaseChart {
    constructor(props: IVisConstruct) {
        super(props);
        this.type = VisualizationTypes.SCATTER;
        this.supportedPropertiesList = SCATTERPLOT_SUPPORTED_PROPERTIES;
        this.initializeProperties(props.visualizationProperties);
    }

    public getExtendedReferencePoint(referencePoint: IReferencePoint): Promise<IExtendedReferencePoint> {
        const clonedReferencePoint = cloneDeep(referencePoint);
        let newReferencePoint: IExtendedReferencePoint = {
            ...clonedReferencePoint,
            uiConfig: cloneDeep(DEFAULT_SCATTERPLOT_UICONFIG),
        };

        newReferencePoint = removeAllArithmeticMeasuresFromDerived(newReferencePoint);
        newReferencePoint = removeAllDerivedMeasures(newReferencePoint);

        newReferencePoint[BUCKETS] = transformBuckets(newReferencePoint.buckets);

        newReferencePoint = setScatterPlotUiConfig(newReferencePoint, this.intl, this.type);
        newReferencePoint = configurePercent(newReferencePoint, true);
        newReferencePoint = configureOverTimeComparison(
            newReferencePoint,
            !!this.featureFlags[SettingCatalog.enableWeekFilters],
        );
        newReferencePoint = getReferencePointWithSupportedProperties(
            newReferencePoint,
            this.supportedPropertiesList,
        );
        newReferencePoint = removeSort(newReferencePoint);

        return Promise.resolve(sanitizeFilters(newReferencePoint));
    }

    protected renderConfigurationPanel(insight: IInsightDefinition) {
        if (document.querySelector(this.configPanelElement)) {
            render(
                <ScatterPlotConfigurationPanel
                    locale={this.locale}
                    references={this.references}
                    properties={this.visualizationProperties}
                    propertiesMeta={this.propertiesMeta}
                    insight={insight}
                    colors={this.colors}
                    pushData={this.handlePushData}
                    type={this.type}
                    isError={this.getIsError()}
                    isLoading={this.isLoading}
                    featureFlags={this.featureFlags}
                />,
                document.querySelector(this.configPanelElement),
            );
        }
    }
}
