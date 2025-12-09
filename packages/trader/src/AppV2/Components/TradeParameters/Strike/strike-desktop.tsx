import React, { useCallback, useRef, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv-com/translations';

import { InputPopover } from 'AppV2/Components/InputPopover';
import { useTraderStore } from 'Stores/useTraderStores';

import { TTradeParametersProps } from '../trade-parameters';

import './strike-desktop.scss';

const StrikeDesktop = observer(({ is_minimized }: TTradeParametersProps) => {
    const { barrier_1, barrier_choices, is_market_closed, onChange } = useTraderStore();

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const inputRef = useRef<HTMLDivElement>(null);

    const handleOpenPopover = useCallback(() => {
        setIsPopoverOpen(true);
    }, []);

    const handleClosePopover = useCallback(() => {
        setIsPopoverOpen(false);
    }, []);

    const handleStrikeSelect = useCallback(
        (value: string) => {
            onChange({ target: { name: 'barrier_1', value } });
            handleClosePopover();
        },
        [onChange, handleClosePopover]
    );

    return (
        <>
            <div ref={inputRef}>
                <TextField
                    variant='fill'
                    readOnly
                    label={
                        <Localize i18n_default_text='Strike price' key={`strike${is_minimized ? '-minimized' : ''}`} />
                    }
                    value={barrier_1}
                    noStatusIcon
                    disabled={is_market_closed}
                    className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
                    onClick={handleOpenPopover}
                />
            </div>

            <InputPopover
                isOpen={isPopoverOpen}
                onClose={handleClosePopover}
                triggerRef={inputRef}
                className='strike-popover'
                popoverWidth={160}
            >
                <div className='strike-popover__content'>
                    {barrier_choices.map((strike: string) => {
                        const isSelected = barrier_1 === strike;

                        return (
                            <button
                                key={strike}
                                type='button'
                                className={clsx('strike-popover__option', {
                                    'strike-popover__option--selected': isSelected,
                                })}
                                onClick={() => handleStrikeSelect(strike)}
                            >
                                {strike}
                            </button>
                        );
                    })}
                </div>
            </InputPopover>
        </>
    );
});

export default StrikeDesktop;
