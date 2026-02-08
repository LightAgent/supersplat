import { BooleanInput, Container, Element, Label } from '@playcanvas/pcui';

import { Events } from '../events';
import { localize } from './localization';
import { SplatList } from './splat-list';
import sceneImportSvg from './svg/import.svg';
import sceneNewSvg from './svg/new.svg';
import { Tooltips } from './tooltips';
import { Transform } from './transform';

const createSvg = (svgString: string) => {
    const decodedStr = decodeURIComponent(svgString.substring('data:image/svg+xml,'.length));
    return new DOMParser().parseFromString(decodedStr, 'image/svg+xml').documentElement;
};

class ScenePanel extends Container {
    constructor(events: Events, tooltips: Tooltips, args = {}) {
        args = {
            ...args,
            id: 'scene-panel',
            class: 'panel'
        };

        super(args);

        // stop pointer events bubbling
        ['pointerdown', 'pointerup', 'pointermove', 'wheel', 'dblclick'].forEach((eventName) => {
            this.dom.addEventListener(eventName, (event: Event) => event.stopPropagation());
        });

        const sceneHeader = new Container({
            class: 'panel-header'
        });

        const sceneIcon = new Label({
            text: '\uE344',
            class: 'panel-header-icon'
        });

        const sceneLabel = new Label({
            text: localize('panel.scene-manager'),
            class: 'panel-header-label'
        });
        
        const sceneImport = new Container({
            class: 'panel-header-button'
        });
        sceneImport.dom.appendChild(createSvg(sceneImportSvg));

        const sceneNew = new Container({
            class: 'panel-header-button'
        });
        sceneNew.dom.appendChild(createSvg(sceneNewSvg));

        sceneHeader.append(sceneIcon);
        sceneHeader.append(sceneLabel);
        sceneHeader.append(sceneImport);
        sceneHeader.append(sceneNew);

        sceneImport.on('click', async () => {
            await events.invoke('scene.import');
        });

        sceneNew.on('click', () => {
            events.invoke('doc.new');
        });

        tooltips.register(sceneImport, 'Import Scene', 'top');
        tooltips.register(sceneNew, 'New Scene', 'top');

        const splatList = new SplatList(events);

        const splatListContainer = new Container({
            class: 'splat-list-container'
        });
        splatListContainer.append(splatList);

        const transformHeader = new Container({
            class: 'panel-header'
        });

        const transformIcon = new Label({
            text: '\uE111',
            class: 'panel-header-icon'
        });

        const transformLabel = new Label({
            text: localize('panel.scene-manager.transform'),
            class: 'panel-header-label'
        });

        transformHeader.append(transformIcon);
        transformHeader.append(transformLabel);
        
        const segmentationHeader = new Container({
            class: 'panel-header'
        });

        const segmentationIcon = new Label({
            text: "\uE53B",
            class: 'panel-header-icon'
        });

        const segmentationLabel = new Label({
            text: "Segmentation",
            class: 'panel-header-label'
        });

        segmentationHeader.append(segmentationIcon);
        segmentationHeader.append(segmentationLabel);

        this.append(sceneHeader);
        this.append(splatListContainer);
        this.append(transformHeader);
        this.append(new Transform(events));
        this.append(new Element({
            class: 'panel-header',
            height: 20
        }));
        this.append(segmentationHeader);

        // segmentation choices 
        const segmentationOptions = new Container({
            class: 'segmentation-options'
        });

        const segmentationInputs: BooleanInput[] = [];

        const segmentationLabels = [
            'Csf',
            'Fat',
            'Gli',
            'Grey',
            'Muscle + Skin',
            'Mit',
            'Skull',
            'Skin',
            'White'
        ];

        segmentationLabels.forEach((label, index) => {
            const row = new Container({
                class: 'segmentation-option-row'
            });

            const input = new BooleanInput();
            segmentationInputs.push(input);

            input.on('change', (value: boolean) => {
                switch (label) {
                    case 'Csf':
                        console.log('Csf');
                        break;
                    case 'Fat':
                        console.log('Fat');
                        break;
                    case 'Gli':
                        console.log('Gli');
                        break;
                    case 'Grey':
                        console.log('Grey');
                        break;
                    case 'Muscle + Skin':
                        console.log('Muscle + Skin');
                        break;
                    case 'Mit':
                        console.log('Mit');
                        break;
                    case 'Skull':
                        console.log('Skull');
                        break;
                    case 'Skin':
                        console.log('Skin');
                        break;
                    case 'White':
                        console.log('White');
                        break;
                }
            });

            row.append(input);

            row.append(new Label({
                text: label
            }));

            segmentationOptions.append(row);
        });

        this.append(segmentationOptions);
    }
}

export { ScenePanel };
